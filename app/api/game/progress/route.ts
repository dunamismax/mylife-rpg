
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
    const { xpGained, statsAffected, hpAffected } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stats: true },
    });

    if (!user || !user.stats) {
      return NextResponse.json({ message: 'User or user stats not found' }, { status: 404 });
    }

    let newXp = user.stats.xp + xpGained;
    let newLevel = user.stats.level;
    let newHp = user.stats.hp + (hpAffected || 0);

    // Level up logic
    const xpToNextLevel = Math.round(newLevel * 100 * 1.2);
    if (newXp >= xpToNextLevel) {
      newLevel++;
      // Optionally, reset XP to remaining after level up or keep cumulative
      // For now, let's keep cumulative XP and just increment level
    }

    // Apply stat changes (simplified for now, will need more robust parsing)
    let newStrength = user.stats.strength;
    let newEndurance = user.stats.endurance;
    let newIntelligence = user.stats.intelligence;
    let newWisdom = user.stats.wisdom;
    let newCharisma = user.stats.charisma;
    let newWillpower = user.stats.willpower;

    if (statsAffected) {
      const statChanges = statsAffected.split(',').map((s: string) => s.trim());
      statChanges.forEach((change: string) => {
        const match = change.match(/([+-]\d+)\s*(STR|END|INT|WIS|CHA|WIL)/);
        if (match) {
          const value = parseInt(match[1]);
          const stat = match[2];
          switch (stat) {
            case 'STR': newStrength += value; break;
            case 'END': newEndurance += value; break;
            case 'INT': newIntelligence += value; break;
            case 'WIS': newWisdom += value; break;
            case 'CHA': newCharisma += value; break;
            case 'WIL': newWillpower += value; break;
          }
        }
      });
    }

    const updatedStats = await prisma.stats.update({
      where: { id: user.stats.id },
      data: {
        xp: newXp,
        level: newLevel,
        hp: newHp,
        strength: newStrength,
        endurance: newEndurance,
        intelligence: newIntelligence,
        wisdom: newWisdom,
        charisma: newCharisma,
        willpower: newWillpower,
      },
    });

    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error('Error updating game progress:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
