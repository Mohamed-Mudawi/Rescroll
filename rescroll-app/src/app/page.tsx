'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user, username, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
        <div className="text-2xl text-gray-500">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-4xl text-gray-500 font-bold mb-4">
        {user && username ? `Welcome back, ${username}!` : 'Welcome to Rescroll'}
      </h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-6">
        Rescroll is your personal resume scroller — easily manage, browse, and view
        multiple resumes in one smooth experience.
      </p>
      <p className="text-lg text-gray-500 max-w-xl text-center mb-6">
        Created by Mohamed Mudawi - CodePath Final Project
      </p>
      <button
        onClick={() => router.push('/resumes')}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Take me to Resume Scroller
      </button>
      
      {!user && (
        <p className="mt-4 text-gray-600">
          <span className="cursor-pointer text-[#ff5757] hover:underline" onClick={() => router.push('/login')}>
            Sign in
          </span>
          {' '}or{' '}
          <span className="cursor-pointer text-[#ff5757] hover:underline" onClick={() => router.push('/signup')}>
            create an account
          </span>
          {' '}to get started!
        </p>
      )}
    </main>
  );
}