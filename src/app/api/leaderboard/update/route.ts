import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { totalAmount } = req.body;

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid totalAmount value' });
    }

    // Find the user in DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update totalAmount
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        totalAmount: (user.totalAmount || 0) + totalAmount,
      },
    });

    return res.status(200).json({ message: 'Leaderboard updated', user: updatedUser });
  } catch (error) {
    console.error('Error in leaderboard update:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}