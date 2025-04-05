'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Trophy } from 'lucide-react';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  const username: string = session?.user?.username || session?.user?.name || 'Guest';
  const userRole: string = session?.user?.role || ''; // Assuming role is populated from session

  console.log("SESSION: ", session);
  console.log("USERNAME: ", username);
  console.log("USER ROLE: ", userRole);
  console.log("STATUS: ", status);

  const guestNavItems: React.ReactNode = (
    <>
      <li><Link href="/" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Home</Link></li>
      <li><Link href="/blogs" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Blog</Link></li>
      <li><Link href="/contact" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Contact</Link></li>
    </>
  );

  const userNavItems: React.ReactNode = (
    <>
      <li><Link href="/" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Home</Link></li>
      <li><Link href="/game/id" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Play Game</Link></li>
      <li><Link href="/leader" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Leader Board</Link></li>
      <li><Link href="/store" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Store</Link></li>
      <li><Link href="/blogs" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Blog</Link></li>
      <li><Link href="/contact" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Contact</Link></li>
    </>
  );

  const adminNavItem: React.ReactNode = (
    <li><Link href="/admin/dashboard" className="hover:text-yellow-400 transition-colors duration-300 font-medium">Admin Panel</Link></li>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg">
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-10">
        <div className="navbar py-4 flex justify-between items-center text-white">
          
          {/* Navbar Left */}
          <div className="navbar-start flex items-center">
            {/* Mobile Menu */}
            <div className="dropdown lg:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow bg-blue-900 rounded-box w-52 space-y-2">
                {status === 'authenticated' ? (<>{userNavItems}{userRole === 'admin' && adminNavItem}</>) : guestNavItems}
              </ul>
            </div>
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="text-yellow-400 w-8 h-8 animate-bounce" />
              <span className="text-2xl font-bold tracking-wide">Jeopardy Quiz</span>
            </Link>
          </div>

          {/* Navbar Center (Desktop Menu) */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 space-x-6">
              {status === 'authenticated' ? (<>{userNavItems}{userRole === 'admin' && adminNavItem}</>) : guestNavItems}
            </ul>
          </div>

          {/* Navbar Right */}
          <div className="navbar-end flex items-center space-x-4">
            {status === 'authenticated' && (
              <>
                <div className="hidden md:flex flex-col text-right">
                  <p className="text-xl font-semibold">Hi, {username}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            )}
            {status !== 'authenticated' && (
              <Link href="/auth/signin" className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition duration-300">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;