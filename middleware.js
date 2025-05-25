import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/tasks/create', '/api/tasks'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('token');

  // If accessing a protected route without token, redirect to login
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT token
    await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};