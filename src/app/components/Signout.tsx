'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const SignoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
    >
      Signout
    </button>
  );
};

export default SignoutButton;
