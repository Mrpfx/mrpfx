'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({
                login: email,
                password: password,
            });
            router.push(redirectPath); // Redirect after login
        } catch (err: any) {
            const errorDetail = err.response?.data?.detail;
            if (errorDetail === 'PASSWORD_RESET_REQUIRED') {
                router.push('/forgot-password?reason=forced_reset');
            } else {
                setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] flex items-center justify-center">
            <div className="w-full max-w-6xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">

                {/* Left Side - Welcome Text */}
                <div className="w-full md:w-1/2 space-y-4 pl-8">
                    <h1 className="text-4xl md:text-[42px] font-bold text-black tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 text-[15px] leading-relaxed max-w-md font-medium">
                        We have a community of over 30,000 Forex Traders where continuous Forex Technical and Fundamental analysis is being shared
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-[450px]">
                    <div className="bg-white rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.08)] p-8 md:p-10 border border-gray-50">
                        <h2 className="text-2xl font-bold text-black mb-8">
                            Sign In
                        </h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Username/Email */}
                            <div className="space-y-2">
                                <label className="text-[13px] text-gray-600 block font-medium">
                                    Username or Email Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Username or Email Address"
                                    className="w-full px-4 py-3 border border-[#2A3596] rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#2A3596] text-gray-900 placeholder-gray-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[13px] text-gray-600 block font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 border border-[#2A3596] rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#2A3596] text-gray-900 placeholder-gray-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#2A3596] focus:ring-[#2A3596] border-gray-300 rounded"
                                        defaultChecked
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-[13px] text-gray-700 font-medium">
                                        Remember Me
                                    </label>
                                </div>

                                <div className="text-[13px]">
                                    <Link href="/forgot-password" className="font-medium text-[#2A3596] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[4px] shadow-sm text-sm font-bold text-white bg-[#2A3596] hover:bg-[#202875] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A3596] disabled:opacity-50"
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>

                            {/* Register Now Link */}
                            <div className="text-center">
                                <Link href="/sign-up" className="text-[13px] font-medium text-black hover:underline">
                                    Register Now
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Register Text */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600 text-[13px] font-bold">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="text-black hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
