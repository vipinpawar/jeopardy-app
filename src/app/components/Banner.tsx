'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Banner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-400 to-indigo-500 py-16">
      {/* Background circles */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-screen-2xl container mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Text Section */}
          <motion.div
            className="w-full md:w-1/2 mt-12 md:mt-0 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl text-black font-bold leading-tight drop-shadow-lg">
                🎉 Welcome to <br /> Jeopardy Quiz Challenge! 🎉
              </h1>
              <p className="text-lg md:text-xl text-black leading-relaxed">
                Get ready to test your knowledge and challenge your skills! 🚀 <br />
                <br />
                🔹 Sign in to start playing. <br />
                🔹 Answer exciting questions across various categories. <br />
                🔹 Earn points and climb the leaderboard! <br />
                <br />
                Let’s see if you have what it takes to be the ultimate quiz champion! 🏆
              </p>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/auth/signin"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black text-xl font-semibold px-8 py-4 rounded-full shadow-md transition duration-300 ease-in-out"
                >
                  🚀 Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/jeopardyimg.jpg"
              alt="Jeopardy Logo"
              className="w-full max-w-md rounded-3xl shadow-lg hover:scale-105 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;