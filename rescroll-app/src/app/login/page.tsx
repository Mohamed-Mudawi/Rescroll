'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase, usersApi } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // First, find the user by username to get their email
            const userData = await usersApi.getUserByUsername(username);

            if (!userData) {
                setError('Username not found');
                return;
            }

            // Now sign in with the actual email
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userData.email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes('Invalid login credentials')) {
                    setError('Invalid username or password');
                } else {
                    setError(signInError.message);
                }
                return;
            }

            // Successful login - redirect to home
            router.push('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [username, password, router]);

    return (
        <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 pt-0">
            <div className="mb-0">
                <Image src="/Rescroll_logo_dark.png" alt="Rescroll Logo" width={200} height={200} priority />
            </div>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 mb-20 rounded-lg shadow-md w-full max-w-md text-black">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <label className="block mb-4">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100"
                        placeholder="Enter your username"
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100"
                        placeholder="Enter your password"
                    />
                </label>

                <button
                    type="submit"
                    disabled={isLoading || !username.trim() || !password.trim()}
                    className="w-full bg-[#ff5757] text-white py-2 rounded-md hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? 'Signing In...' : 'Sign In'}
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