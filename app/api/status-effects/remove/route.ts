
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
    const { id } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await prisma.statusEffect.update({
      where: { id, userId: user.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Status effect removed successfully' });
  } catch (error) {
    console.error('Error removing status effect:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
