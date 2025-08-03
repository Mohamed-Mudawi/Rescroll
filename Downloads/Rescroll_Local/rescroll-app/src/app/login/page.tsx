'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: integrate with Supabase auth
        console.log('Login attempt:', { username, password });
        // For now, redirect to home
        router.push('/');
    };

    return (
        <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 pt-0">
            <div className="mb-0">
                <Image src="/Rescroll_logo_dark.png" alt="Rescroll Logo" width={200} height={200} priority />
            </div>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-black">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h1>

                <label className="block mb-4">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-[#ff5757] text-white py-2 rounded-md hover:bg-red-600 transition">
                    Sign In
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="font-medium text-[#ff5757] hover:underline">
                        Sign up
                    </a>
                </p>
            </form>
        </main>
    );
}