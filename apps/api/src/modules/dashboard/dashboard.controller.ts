import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { sendSuccess } from "../../utils/response";

export const getDashboard = async (_req: Request, res: Response) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalRooms, availableRooms, checkedIn, todayArrivals, todayDepartures,
    pendingReservations, totalCustomers, monthlyRevenue, recentReservations] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: "available" } }),
    prisma.reservation.count({ where: { status: "checked_in" } }),
    prisma.reservation.count({ where: { checkIn: { gte: today, lt: tomorrow } } }),
    prisma.reservation.count({ where: { checkOut: { gte: today, lt: tomorrow } } }),
    prisma.reservation.count({ where: { status: "pending" } }),
    prisma.customer.count(),
    prisma.reservation.aggregate({ where: { status: "checked_out", createdAt: { gte: thisMonth } }, _sum: { totalAmount: true } }),
    prisma.reservation.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { customer: { select: { name: true } }, room: { select: { roomNo: true, roomType: { select: { name: true } } } } } }),
  ]);

  return sendSuccess(res, {
    stats: { totalRooms, availableRooms, occupiedRooms: totalRooms - availableRooms, checkedIn, todayArrivals, todayDepartures, pendingReservations, totalCustomers, monthlyRevenue: monthlyRevenue._sum.totalAmount || 0 },
    recentReservations,
  });
};
