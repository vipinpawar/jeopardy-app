import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // If you want to use session-based authentication:
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { totalAmount } = body;

    if (typeof totalAmount !== 'number') {
      return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    // Find the user by email (from session)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the totalAmount in the DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { totalAmount },
    });

    return NextResponse.json(
      { message: 'Amount updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating amount:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
