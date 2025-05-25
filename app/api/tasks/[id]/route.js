import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getTokenData } from '../../../../lib/auth';

const prisma = new PrismaClient();

// Helper function to check task ownership
async function checkTaskOwnership(taskId, userId) {
  const task = await prisma.task.findUnique({
    where: { id: parseInt(taskId) },
  });

  if (!task) {
    return false;
  }

  return task.userId === userId;
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request, { params }) {
  try {
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const taskId = params.id;
    const { title, description, dueDate } = await request.json();

    // Validate input
    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    // Check task ownership
    const isOwner = await checkTaskOwnership(taskId, tokenData.userId);
    if (!isOwner) {
      return NextResponse.json(
        { message: 'Unauthorized to modify this task' },
        { status: 403 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request, { params }) {
  try {
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const taskId = params.id;

    // Check task ownership
    const isOwner = await checkTaskOwnership(taskId, tokenData.userId);
    if (!isOwner) {
      return NextResponse.json(
        { message: 'Unauthorized to delete this task' },
        { status: 403 }
      );
    }

    await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}