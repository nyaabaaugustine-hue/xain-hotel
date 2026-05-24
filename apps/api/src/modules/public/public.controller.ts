import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { sendSuccess, sendError } from "../../utils/response";

const generateBookingNo = () => "BK" + Date.now().toString().slice(-8);

/** GET /api/public/rooms — list all rooms (no auth required) */
export const listRooms = async (_req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: { roomNo: "asc" },
  });
  return sendSuccess(res, rooms);
};

/** GET /api/public/rooms/available?checkIn=&checkOut= — availability check */
export const availableRooms = async (req: Request, res: Response) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) return sendError(res, "checkIn and checkOut required");

  const booked = await prisma.reservation.findMany({
    where: {
      status: { notIn: ["cancelled", "checked_out"] },
      OR: [
        {
          checkIn: { lte: new Date(checkOut as string) },
          checkOut: { gte: new Date(checkIn as string) },
        },
      ],
    },
    select: { roomId: true },
  });
  const bookedIds = booked.map((b: { roomId: number }) => b.roomId);

  const rooms = await prisma.room.findMany({
    where: { status: "available", id: { notIn: bookedIds } },
    include: { roomType: true },
  });
  return sendSuccess(res, rooms);
};

/**
 * POST /api/public/booking — create a reservation from the public website.
 * Creates (or finds) a customer, then creates the reservation.
 */
export const createPublicBooking = async (req: Request, res: Response) => {
  const {
    name, email, phone,
    roomId, checkIn, checkOut,
    adults = 1, children = 0,
    totalAmount, paymentMethod = "cash", notes,
  } = req.body;

  if (!name || !email || !roomId || !checkIn || !checkOut) {
    return sendError(res, "name, email, roomId, checkIn and checkOut are required");
  }

  // Find or create customer
  let customer = await prisma.customer.findFirst({ where: { email } });
  if (!customer) {
    customer = await prisma.customer.create({ data: { name, email, phone } });
  }

  // Check room availability
  const conflict = await prisma.reservation.findFirst({
    where: {
      roomId: +roomId,
      status: { notIn: ["cancelled", "checked_out"] },
      OR: [
        {
          checkIn: { lte: new Date(checkOut) },
          checkOut: { gte: new Date(checkIn) },
        },
      ],
    },
  });
  if (conflict) return sendError(res, "Room is not available for the selected dates");

  const reservation = await prisma.reservation.create({
    data: {
      bookingNo: generateBookingNo(),
      customerId: customer.id,
      roomId: +roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults: +adults,
      children: +children,
      totalAmount: totalAmount ? +totalAmount : 0,
      paymentMethod,
      notes,
    },
    include: { customer: true, room: { include: { roomType: true } } },
  });

  return sendSuccess(res, reservation, "Reservation created successfully", 201);
};
