
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { quests: true, habits: true, achievements: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const unlockedAchievements: string[] = [];

    // Example Achievement: "First Steps" - Complete 1 quest
    const firstStepsAchievement = user.achievements.find(a => a.name === "First Steps");
    if (!firstStepsAchievement && user.quests.filter(q => q.completed).length >= 1) {
      await prisma.achievement.create({
        data: {
          name: "First Steps",
          description: "Complete your first quest.",
          condition: "Complete 1 quest",
          reward: "+50 XP",
          unlocked: true,
          unlockedAt: new Date(),
          userId: user.id,
        },
      });
      unlockedAchievements.push("First Steps");
    }

    // Example Achievement: "Week Warrior" - Complete 7 daily quests
    const weekWarriorAchievement = user.achievements.find(a => a.name === "Week Warrior");
    if (!weekWarriorAchievement && user.quests.filter(q => q.type === "daily" && q.completed).length >= 7) {
      await prisma.achievement.create({
        data: {
          name: "Week Warrior",
          description: "Complete 7 daily quests.",
          condition: "Complete 7 daily quests",
          reward: "+1 to all stats",
          unlocked: true,
          unlockedAt: new Date(),
          userId: user.id,
        },
      });
      unlockedAchievements.push("Week Warrior");
    }

    // Add more achievement logic here based on your HTML file

    return NextResponse.json({ message: 'Achievement check completed', unlocked: unlockedAchievements });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
