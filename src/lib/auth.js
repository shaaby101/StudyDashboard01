import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const TOKEN_NAME = 'studesh-token';

const ROLE_MAP = {
  student: 'STUDENT',
  faculty: 'FACULTY',
  admin: 'ADMIN',
  parent: 'PARENT',
};

export function normalizeRole(role) {
  const key = String(role || '').toLowerCase();
  return ROLE_MAP[key] || null;
}

export function toClientRole(role) {
  return String(role || '').toLowerCase();
}

export function getTokenName() {
  return TOKEN_NAME;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
