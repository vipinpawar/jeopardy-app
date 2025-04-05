import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        totalAmount: true,
      },
      orderBy: {
        totalAmount: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

