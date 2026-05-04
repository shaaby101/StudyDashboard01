import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTokenName, hashPassword, normalizeRole, signToken, toClientRole } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const roleEnum = normalizeRole(body?.role);

    if (!name || !email || !password || !roleEnum) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: roleEnum },
    });

    const token = await signToken({
      sub: user.id,
      role: toClientRole(user.role),
      name: user.name,
      email: user.email,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: toClientRole(user.role),
      },
    });

    response.cookies.set(getTokenName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}
