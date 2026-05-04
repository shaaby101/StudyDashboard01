import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ROLE_PATHS = {
  student: '/student',
  faculty: '/faculty',
  admin: '/admin',
  parent: '/parent',
};

async function getPayload(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('studesh-token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await getPayload(token);
  const role = String(payload?.role || '').toLowerCase();

  if (!ROLE_PATHS[role]) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = Object.keys(ROLE_PATHS).find(r => pathname.startsWith(ROLE_PATHS[r]));
  if (requiredRole && requiredRole !== role) {
    const roleUrl = new URL(ROLE_PATHS[role], request.url);
    return NextResponse.redirect(roleUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/faculty/:path*', '/admin/:path*', '/parent/:path*'],
};
