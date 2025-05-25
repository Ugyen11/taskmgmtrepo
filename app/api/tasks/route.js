import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getTokenData } from '../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/tasks - Get all tasks for the authenticated user
export async function GET(request) {
  try {
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: tokenData.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request) {
  try {
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, dueDate } = await request.json();

    // Validate input
    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: tokenData.userId
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}