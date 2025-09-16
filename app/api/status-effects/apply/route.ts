
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, cause, duration, penalty, expiresAt } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newStatusEffect = await prisma.statusEffect.create({
      data: {
        name,
        description,
        cause,
        duration,
        penalty,
        isActive: true,
        appliedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: user.id,
      },
    });

    return NextResponse.json(newStatusEffect, { status: 201 });
  } catch (error) {
    console.error('Error applying status effect:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
