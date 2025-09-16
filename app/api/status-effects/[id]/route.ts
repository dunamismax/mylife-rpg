
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
    const { name, description, cause, duration, penalty, isActive, expiresAt } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedStatusEffect = await prisma.statusEffect.update({
      where: { id, userId: user.id },
      data: {
        name,
        description,
        cause,
        duration,
        penalty,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(updatedStatusEffect);
  } catch (error) {
    console.error('Error updating status effect:', error);
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

    await prisma.statusEffect.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ message: 'Status effect deleted successfully' });
  } catch (error) {
    console.error('Error deleting status effect:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
