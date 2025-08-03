'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
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

          {/* Sign In Button */}
          <Link href="/login" className="px-4 py-2 bg-white text-[#ff5757] rounded hover:bg-gray-100">
            Sign In
          </Link>

        </div>
      </div>
    </nav>
  );
}

