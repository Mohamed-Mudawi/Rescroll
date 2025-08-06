
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

// Validation functions
const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
};

const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 10) return 'Password must be at least 10 characters long';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return null;
};

const validateUsername = (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (username.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
};

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        const emailError = validateEmail(formData.email);
        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);

        if (emailError) newErrors.email = emailError;
        if (usernameError) newErrors.username = usernameError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Check if username already exists
            const { data: existingUser, error: usernameCheckError } = await supabase
                .from('users')
                .select('username')
                .eq('username', formData.username)
                .single();

            if (existingUser) {
                setErrors({ username: 'Username already exists' });
                setIsLoading(false);
                return;
            }

            // Create the user account with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: undefined, // Disable email confirmation
                    data: {
                        username: formData.username // Store username in auth metadata
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    setErrors({ email: 'Email already registered' });
                } else {
                    setGeneralError(authError.message);
                }
                setIsLoading(false);
                return;
            }

            if (!authData.user) {
                setGeneralError('Failed to create account');
                setIsLoading(false);
                return;
            }

            // Insert user data into the users table
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    username: formData.username,
                    email: formData.email,
                    created_at: new Date().toISOString()
                });

            if (insertError) {
                console.error('Error inserting user data:', insertError);
                // Note: The auth user was created but we couldn't insert into users table
                // You might want to handle this case differently
                setGeneralError('Account created but there was an error saving user data');
                setIsLoading(false);
                return;
            }

            console.log('Signed up successfully:', authData);
            
            // Auto sign-in the user after successful account creation
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) {
                console.error('Error signing in after signup:', signInError);
                // Account was created successfully, but auto sign-in failed
                // Redirect to login page with success message
                alert('Account created successfully! Please sign in.');
                router.push('/login');
                return;
            }

            // Successfully signed up and signed in
            router.push('/');
        } catch (err) {
            console.error('Unexpected error:', err);
            setGeneralError('An unexpected error occurred');
            setIsLoading(false);
        }
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
                className="bg-white p-8 rounded-lg mb-20 shadow-md w-full max-w-md text-black"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Create Account
                </h1>

                {generalError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {generalError}
                    </div>
                )}

                <label className="block mb-4">
                    <span className="text-gray-700">Email Address</span>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100 ${
                            errors.email ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mt-1">{errors.email}</span>
                    )}
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100 ${
                            errors.username ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.username && (
                        <span className="text-red-500 text-sm mt-1">{errors.username}</span>
                    )}
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100 ${
                            errors.password ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                        Password must be at least 10 characters with uppercase, lowercase, number, and special character
                    </div>
                </label>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#ff5757] text-white py-2 rounded-md hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
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