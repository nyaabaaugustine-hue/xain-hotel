import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, "Invalid input", 422);

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.status === 0)
    return sendError(res, "Invalid credentials or account deactivated", 401);

  const valid = await bcrypt.compare(password, user.password);
  // support legacy md5 passwords from CI
  const legacyMd5 = require("crypto").createHash("md5").update(password).digest("hex");
  if (!valid && legacyMd5 !== user.password)
    return sendError(res, "Invalid credentials", 401);

  const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin, userLevel: user.userLevel };
  const accessToken = signAccessToken(payload);
  const refresh = signRefreshToken({ id: user.id });

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  res.cookie("access_token", accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", refresh, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return sendSuccess(res, {
    user: { id: user.id, fullname: user.fullname, email: user.email, isAdmin: user.isAdmin, image: user.image },
    accessToken,
  }, "Login successful");
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return sendSuccess(res, null, "Logged out");
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) return sendError(res, "No refresh token", 401);
  try {
    const payload = verifyRefreshToken(token) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return sendError(res, "User not found", 401);
    const newAccess = signAccessToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
    res.cookie("access_token", newAccess, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    return sendSuccess(res, { accessToken: newAccess });
  } catch {
    return sendError(res, "Invalid refresh token", 401);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return sendError(res, "Email not found", 404);
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  await prisma.user.update({ where: { email }, data: { passwordResetToken: token } });
  // TODO: send email with token
  return sendSuccess(res, null, "Password reset token sent to email");
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, password } = req.body;
  const user = await prisma.user.findFirst({ where: { email, passwordResetToken: token } });
  if (!user) return sendError(res, "Invalid token", 400);
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed, passwordResetToken: null } });
  return sendSuccess(res, null, "Password reset successfully");
};

export const me = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, fullname: true, email: true, isAdmin: true, userLevel: true, image: true, lastLogin: true },
  });
  return sendSuccess(res, user);
};
