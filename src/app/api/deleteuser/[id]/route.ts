import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

interface Params {
  id: string;
}

export const DELETE = async (req: Request, { params }: { params: Params }) => {
  const { id } = params; // Grab the id from route params
  console.log(id);

  try {
    // First, check if the user exists 
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
};
