import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTokenName, toClientRole, verifyToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get(getTokenName())?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = await verifyToken(token);
  if (!payload?.sub) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({ where: { id: String(payload.sub) } });
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toClientRole(user.role),
    },
  });
}
