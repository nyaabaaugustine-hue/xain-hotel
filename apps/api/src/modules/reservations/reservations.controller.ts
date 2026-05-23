import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth";

const generateBookingNo = () => "BK" + Date.now().toString().slice(-8);

export const getReservations = async (req: Request, res: Response) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const skip = (+page - 1) * +limit;
  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { bookingNo: { contains: search as string } },
      { customer: { name: { contains: search as string } } },
    ];
  }
  const [data, total] = await Promise.all([
    prisma.reservation.findMany({
      where, skip, take: +limit,
      include: { customer: true, room: { include: { roomType: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.reservation.count({ where }),
  ]);
  return sendSuccess(res, { data, total, page: +page, totalPages: Math.ceil(total / +limit) });
};

export const getStats = async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [total, pending, checkedIn, todayArrivals, todayDepartures, totalRooms, availableRooms] =
    await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "pending" } }),
      prisma.reservation.count({ where: { status: "checked_in" } }),
      prisma.reservation.count({ where: { checkIn: { gte: today, lt: tomorrow } } }),
      prisma.reservation.count({ where: { checkOut: { gte: today, lt: tomorrow } } }),
      prisma.room.count(),
      prisma.room.count({ where: { status: "available" } }),
    ]);

  return sendSuccess(res, { total, pending, checkedIn, todayArrivals, todayDepartures, totalRooms, availableRooms, occupiedRooms: totalRooms - availableRooms });
};

export const getReservation = async (req: Request, res: Response) => {
  const r = await prisma.reservation.findUnique({
    where: { id: +req.params.id },
    include: { customer: true, room: { include: { roomType: true } }, user: { select: { fullname: true } } },
  });
  if (!r) return sendError(res, "Reservation not found", 404);
  return sendSuccess(res, r);
};

export const createReservation = async (req: AuthRequest, res: Response) => {
  const { customerId, roomId, checkIn, checkOut, adults, children, totalAmount, paymentMethod, notes } = req.body;

  const conflict = await prisma.reservation.findFirst({
    where: {
      roomId: +roomId,
      status: { notIn: ["cancelled", "checked_out"] },
      OR: [{ checkIn: { lte: new Date(checkOut) }, checkOut: { gte: new Date(checkIn) } }],
    },
  });
  if (conflict) return sendError(res, "Room is not available for selected dates");

  const reservation = await prisma.reservation.create({
    data: {
      bookingNo: generateBookingNo(),
      customerId: +customerId, roomId: +roomId,
      checkIn: new Date(checkIn), checkOut: new Date(checkOut),
      adults: +adults || 1, children: +children || 0,
      totalAmount: +totalAmount, paymentMethod, notes,
      createdBy: req.user?.id,
    },
    include: { customer: true, room: { include: { roomType: true } } },
  });
  return sendSuccess(res, reservation, "Reservation created", 201);
};

export const updateReservation = async (req: Request, res: Response) => {
  const r = await prisma.reservation.update({ where: { id: +req.params.id }, data: req.body });
  return sendSuccess(res, r, "Reservation updated");
};

export const checkIn = async (req: Request, res: Response) => {
  const r = await prisma.reservation.update({
    where: { id: +req.params.id },
    data: { status: "checked_in" },
  });
  await prisma.room.update({ where: { id: r.roomId }, data: { status: "occupied" } });
  return sendSuccess(res, r, "Checked in successfully");
};

export const checkOut = async (req: Request, res: Response) => {
  const r = await prisma.reservation.update({
    where: { id: +req.params.id },
    data: { status: "checked_out", paymentStatus: "paid" },
  });
  await prisma.room.update({ where: { id: r.roomId }, data: { status: "available" } });
  return sendSuccess(res, r, "Checked out successfully");
};

export const cancelReservation = async (req: Request, res: Response) => {
  const r = await prisma.reservation.update({ where: { id: +req.params.id }, data: { status: "cancelled" } });
  await prisma.room.update({ where: { id: r.roomId }, data: { status: "available" } });
  return sendSuccess(res, r, "Reservation cancelled");
};
