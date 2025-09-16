
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { title, description, type, xpReward, difficulty, statsAffected, hpAffected, completed, dueDate, isRecurring, recurrencePattern } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedQuest = await prisma.quest.update({
      where: { id, userId: user.id },
      data: {
        title,
        description,
        type,
        xpReward,
        difficulty,
        statsAffected,
        hpAffected,
        completed,
        dueDate,
        isRecurring,
        recurrencePattern,
      },
    });

    return NextResponse.json(updatedQuest);
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await prisma.quest.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ message: 'Quest deleted successfully' });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
