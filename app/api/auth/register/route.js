import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request) {
  try {
    console.log('Registration attempt started');

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

    const { email, password, name, username } = body;

    // Validate required fields
    if (!email || !password || !name || !username) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required: name, username, email, password' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('Checking for existing user');

    // Check if user already exists (email or username)
    let existingUser;
    try {
      existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });
      console.log('Existing user check result:', existingUser ? 'User exists' : 'User not found');
    } catch (dbError) {
      console.error('Database error during user check:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log('User already exists:', existingUser.email === email ? 'Email taken' : 'Username taken');
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already exists' : 'Username already exists' },
        { status: 400 }
      );
    }

    console.log('Hashing password');

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return NextResponse.json(
        { error: 'Error processing password', details: hashError.message },
        { status: 500 }
      );
    }

    console.log('Creating new user');

    // Create new user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });
      console.log('User created successfully:', user.id);
    } catch (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { error: 'Error creating user', details: createError.message },
        { status: 500 }
      );
    }

    console.log('Registration completed successfully');

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unhandled registration error:', error);
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