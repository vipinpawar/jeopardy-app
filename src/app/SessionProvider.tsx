'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
// import type { ReactNode } from 'react';
// import type { Session } from 'next-auth';

interface NextAuthSessionProviderProps {
  children: ReactNode;
  session?: Session ;
}

export default function NextAuthSessionProvider({
  children,
  session,
}: NextAuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
