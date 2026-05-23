import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { sendSuccess, sendError } from "../../utils/response";

export const getRooms = async (_req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: { roomNo: "asc" },
  });
  return sendSuccess(res, rooms);
};

export const getAvailableRooms = async (req: Request, res: Response) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) return sendError(res, "checkIn and checkOut required");

  const booked = await prisma.reservation.findMany({
    where: {
      status: { notIn: ["cancelled", "checked_out"] },
      OR: [
        { checkIn: { lte: new Date(checkOut as string) }, checkOut: { gte: new Date(checkIn as string) } },
      ],
    },
    select: { roomId: true },
  });
  const bookedIds = booked.map((b) => b.roomId);

  const rooms = await prisma.room.findMany({
    where: { status: "available", id: { notIn: bookedIds } },
    include: { roomType: true },
  });
  return sendSuccess(res, rooms);
};

export const getRoom = async (req: Request, res: Response) => {
  const room = await prisma.room.findUnique({ where: { id: +req.params.id }, include: { roomType: true } });
  if (!room) return sendError(res, "Room not found", 404);
  return sendSuccess(res, room);
};

export const createRoom = async (req: Request, res: Response) => {
  const { roomNo, roomTypeId, floorId, description } = req.body;
  const exists = await prisma.room.findUnique({ where: { roomNo } });
  if (exists) return sendError(res, "Room number already exists");
  const room = await prisma.room.create({ data: { roomNo, roomTypeId: +roomTypeId, floorId: floorId ? +floorId : undefined, description } });
  return sendSuccess(res, room, "Room created", 201);
};

export const updateRoom = async (req: Request, res: Response) => {
  const room = await prisma.room.update({ where: { id: +req.params.id }, data: req.body });
  return sendSuccess(res, room, "Room updated");
};

export const deleteRoom = async (req: Request, res: Response) => {
  await prisma.room.delete({ where: { id: +req.params.id } });
  return sendSuccess(res, null, "Room deleted");
};

export const getRoomTypes = async (_req: Request, res: Response) => {
  const types = await prisma.roomType.findMany({ orderBy: { name: "asc" } });
  return sendSuccess(res, types);
};

export const createRoomType = async (req: Request, res: Response) => {
  const type = await prisma.roomType.create({ data: req.body });
  return sendSuccess(res, type, "Room type created", 201);
};
