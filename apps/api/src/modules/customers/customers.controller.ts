import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { sendSuccess, sendError } from "../../utils/response";

export const getCustomers = async (req: Request, res: Response) => {
  const { search, page = 1, limit = 20 } = req.query;
  const skip = (+page - 1) * +limit;
  const where: any = search ? { OR: [{ name: { contains: search as string } }, { email: { contains: search as string } }, { phone: { contains: search as string } }] } : {};
  const [data, total] = await Promise.all([
    prisma.customer.findMany({ where, skip, take: +limit, orderBy: { createdAt: "desc" } }),
    prisma.customer.count({ where }),
  ]);
  return sendSuccess(res, { data, total, page: +page, totalPages: Math.ceil(total / +limit) });
};

export const getCustomer = async (req: Request, res: Response) => {
  const c = await prisma.customer.findUnique({ where: { id: +req.params.id }, include: { reservations: { include: { room: true }, orderBy: { createdAt: "desc" }, take: 10 } } });
  if (!c) return sendError(res, "Customer not found", 404);
  return sendSuccess(res, c);
};

export const createCustomer = async (req: Request, res: Response) => {
  const customer = await prisma.customer.create({ data: req.body });
  return sendSuccess(res, customer, "Customer created", 201);
};

export const updateCustomer = async (req: Request, res: Response) => {
  const customer = await prisma.customer.update({ where: { id: +req.params.id }, data: req.body });
  return sendSuccess(res, customer, "Customer updated");
};

export const deleteCustomer = async (req: Request, res: Response) => {
  await prisma.customer.delete({ where: { id: +req.params.id } });
  return sendSuccess(res, null, "Customer deleted");
};
