import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as any);

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn } as any);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.jwt.refreshSecret);
