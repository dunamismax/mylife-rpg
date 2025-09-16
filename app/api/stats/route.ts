
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stats: true },
    });

    if (!user || !user.stats) {
      return NextResponse.json({ message: 'User stats not found' }, { status: 404 });
    }

    return NextResponse.json(user.stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { level, xp, hp, strength, endurance, intelligence, wisdom, charisma, willpower } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stats: true },
    });

    if (!user || !user.stats) {
      return NextResponse.json({ message: 'User stats not found' }, { status: 404 });
    }

    const updatedStats = await prisma.stats.update({
      where: { id: user.stats.id },
      data: {
        level,
        xp,
        hp,
        strength,
        endurance,
        intelligence,
        wisdom,
        charisma,
        willpower,
      },
    });

    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
