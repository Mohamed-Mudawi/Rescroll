'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignUpPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: hook up your Supabase (or other) sign-up logic here:
        // const { data, error } = await supabase.auth.signUp({ password });
        // if (error) return alert(error.message);

        console.log('Sign up:', { username, password });
        router.push('/'); // or wherever you want to send new users
    };

    return (
        <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 pt-0">
            <div className="mb-0">
                <Image
                    src="/Rescroll_logo_dark.png"
                    alt="Rescroll Logo"
                    width={200}
                    height={200}
                    priority
                />
            </div>

            <form
                onSubmit={handleSignUp}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-black"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Create Account
                </h1>

                <label className="block mb-4">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-[#ff5757] text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                    Sign Up
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a
                        href="/login"
                        className="font-medium text-[#ff5757] hover:underline"
                    >
                        Sign In
                    </a>
                </p>
            </form>
        </main>
    );
}