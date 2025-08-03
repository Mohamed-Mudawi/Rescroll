'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Rescroll</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-6">
        Rescroll is your personal resume scroller — easily manage, browse, and view
        multiple resumes in one smooth experience.
      </p>
      <button
        onClick={() => router.push('/resumes')}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Take me to Resume Scroller
      </button>
    </main>
  );
}