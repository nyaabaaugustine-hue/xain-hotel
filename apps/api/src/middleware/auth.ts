import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; isAdmin: number; userLevel?: number };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token expired or invalid" });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.isAdmin !== 1) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
