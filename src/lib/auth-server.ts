import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { signToken, signRefreshToken, verifyRefreshToken, type JwtPayload } from "./auth";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export async function authenticateUser(email: string, password: string, ip?: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive) return null;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${remaining} minutes.`);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1;
    const updates: any = { loginAttempts: attempts, lastLoginAttempt: new Date() };

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      updates.loginAttempts = 0;
    }

    await prisma.user.update({ where: { id: user.id }, data: updates });
    return null;
  }

  if (user.loginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null },
    });
  }

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
  const refreshToken = signRefreshToken(payload);

  await prisma.session.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip: ip || "unknown",
    },
  });

  return {
    token: signToken(payload),
    refreshToken,
    expiresIn: 3600,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, region: user.region },
  };
}

export async function rotateRefreshToken(oldToken: string, ip?: string) {
  const payload = verifyRefreshToken(oldToken);
  if (!payload) return null;

  const session = await prisma.session.findFirst({
    where: { token: oldToken, isRevoked: false, expiresAt: { gte: new Date() } },
  });

  if (!session) return null;

  await prisma.session.update({
    where: { id: session.id },
    data: { isRevoked: true, revokedAt: new Date() },
  });

  const newPayload: JwtPayload = { userId: payload.userId, email: payload.email, role: payload.role };
  const newRefreshToken = signRefreshToken(newPayload);

  await prisma.session.create({
    data: {
      userId: payload.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip: ip || "unknown",
    },
  });

  return {
    token: signToken(newPayload),
    refreshToken: newRefreshToken,
    expiresIn: 3600,
  };
}

export async function revokeUserSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  });
}

export async function revokeSession(token: string): Promise<void> {
  await prisma.session.updateMany({
    where: { token, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  });
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
