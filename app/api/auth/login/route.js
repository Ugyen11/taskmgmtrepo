import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { SignJWT } from 'jose';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Log request details
    console.log('Login attempt started');
    
    // Check Prisma client
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format', details: parseError.message },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to find user:', email);

    // Find user by email
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          password: true,
        },
      });
      console.log('User lookup result:', user ? 'User found' : 'User not found');
    } catch (dbError) {
      console.error('Database error during user lookup:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      );
    }

    if (!user) {
      console.log('Invalid credentials - user not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    let isValidPassword = false;
    try {
      isValidPassword = await comparePassword(password, user.password);
      console.log('Password verification result:', isValidPassword ? 'Valid' : 'Invalid');
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return NextResponse.json(
        { error: 'Error verifying credentials', details: passwordError.message },
        { status: 500 }
      );
    }

    if (!isValidPassword) {
      console.log('Invalid credentials - wrong password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate JWT token
    let token;
    try {
      token = await new SignJWT({ 
        userId: user.id,
        email: user.email,
        name: user.name,
        username: user.username
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
      console.log('JWT token generated successfully');
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return NextResponse.json(
        { error: 'Authentication error', details: jwtError.message },
        { status: 500 }
      );
    }

    // Create response
    try {
      const response = NextResponse.json(
        { 
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username
          }
        },
        { status: 200 }
      );

      // Set cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      console.log('Login successful, response created');
      return response;
    } catch (responseError) {
      console.error('Error creating response:', responseError);
      return NextResponse.json(
        { error: 'Error creating response', details: responseError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled login error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}