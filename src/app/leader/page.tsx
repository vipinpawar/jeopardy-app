'use client';

import React from 'react';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Leader {
  id: string;
  username: string;
  email: string;
  totalAmount: number;
}

const fetchLeaderboard = async (): Promise<Leader[]> => {
  const response = await axios.get('/api/leaderboard/get');
  return response.data;
};

const LeaderboardPage: React.FC = () => {
  const { data: leaders = [], isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  const getBadge = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇 1st';
      case 2:
        return '🥈 2nd';
      case 3:
        return '🥉 3rd';
      default:
        return `${rank}th`;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-black text-black py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black text-center">
        Leaderboard
      </h1>

      {isLoading ? (
        <p className="text-lg text-black">Loading leaderboard...</p>
      ) : error ? (
        <p className="text-lg text-red-500">Error fetching leaderboard</p>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="hidden md:block">
            <table className="w-full table-auto border-collapse rounded overflow-hidden shadow-lg bg-white text-black">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Rank</th>
                  <th className="py-4 px-6 text-left">Username</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Amount Won</th>
                </tr>
              </thead>
              <tbody>
                {leaders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No winners yet!
                    </td>
                  </tr>
                ) : (
                  leaders.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-t hover:bg-gray-100 ${
                        index === 0
                          ? 'bg-yellow-50'
                          : index === 1
                          ? 'bg-gray-100'
                          : index === 2
                          ? 'bg-orange-50'
                          : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-bold">
                        {getBadge(index + 1)}
                      </td>
                      <td className="py-4 px-6">{user.username || 'N/A'}</td>
                      <td className="py-4 px-6">{user.email || 'N/A'}</td>
                      <td className="py-4 px-6 text-green-600 font-semibold">
                        {formatCurrency(user.totalAmount || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* === CARDS FOR MOBILE SCREENS === */}
          <div className="md:hidden space-y-4">
            {leaders.length === 0 ? (
              <p className="text-center text-gray-500">No winners yet!</p>
            ) : (
              leaders.map((user, index) => (
                <div
                  key={user.id}
                  className={`rounded-lg shadow-lg p-4 bg-white ${
                    index === 0
                      ? 'border-yellow-400 border-2'
                      : index === 1
                      ? 'border-gray-400 border-2'
                      : index === 2
                      ? 'border-orange-400 border-2'
                      : 'border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xl">{getBadge(index + 1)}</span>
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(user.totalAmount || 0)}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Username:</span>{' '}
                    {user.username || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>{' '}
                    {user.email || 'N/A'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;