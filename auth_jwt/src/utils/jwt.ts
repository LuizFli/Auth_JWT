import jwt from "jsonwebtoken";
import { env } from "../env.ts";

interface JWTPayload {
  userId: number;
  email: string;
  name: string;
}

export const signAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.accessSecret, {
    expiresIn: Number(env.accessTtl),
  });
};

export const signRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.refreshSecret, {
    expiresIn: Number(env.refreshTtl),
  });
};

export const verifyAccess = (token: string): JWTPayload => {
  return jwt.verify(token, env.accessSecret) as JWTPayload;
};

export const verifyRefresh = (token: string): JWTPayload => {
  return jwt.verify(token, env.refreshSecret) as JWTPayload;
};