'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

export default function NavBar() {
  const router = useRouter();
  const { user, username, loading, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      await signOut();
      console.log('SignOut completed, redirecting...');

      // Force redirect to home page
      window.location.href = '/';

    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="w-full bg-[#ff5757] shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/Rescroll_logo.png" alt="Rescroll Logo" width={60} height={60} priority />
            <span className="ml-2 text-2xl font-bold text-white">
              Rescroll
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex space-x-6">
            <Link href="/" className="text-white hover:text-gray-200">
              Home
            </Link>
            <Link href="/resumes" className="text-white hover:text-gray-200">
              Resume Scroller
            </Link>
            <Link href="/discussion" className="text-white hover:text-gray-200">
              Discussion
            </Link>
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="px-4 py-2 bg-white bg-opacity-20 text-white rounded">
                Loading...
              </div>
            ) : user && username ? (
              <>
                {/* Username Display */}
                <span className="text-white font-medium">
                  {username}
                </span>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-[#ff5757] rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Sign In Button */
              <Link href="/login" className="px-4 py-2 bg-white text-[#ff5757] rounded hover:bg-gray-100 transition">
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
