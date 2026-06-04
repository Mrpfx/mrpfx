'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authService } from '@/lib/auth';

const SignupPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [privacy, setPrivacy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!privacy) {
            setError('Please agree to the privacy policy');
            return;
        }

        setLoading(true);

        try {
            await authService.signup({
                email,
                password,
                username: email.split('@')[0], // Simple username generation
                display_name: fullName,
            });
            setSuccess('Account created successfully. Please check your email for verification code.');
            // Clear form
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPrivacy(false);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('An account with this email already exists. Please try logging in or resetting your password.');
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] flex items-center justify-center">
            <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">

                {/* Left Side - Welcome Text */}
                <div className="w-full md:w-1/2 space-y-6 pl-8">
                    <h1 className="text-4xl md:text-[42px] font-bold text-black leading-tight tracking-tight">
                        Get started with<br />
                        <span className="text-[#2A3596]">MrPFx</span>
                    </h1>
                    <p className="text-gray-600 text-[15px] leading-relaxed max-w-lg font-medium">
                        We have a community of over 20,000 Forex Traders where continuous Forex Technical and Fundamental analysis is being shared
                    </p>
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full md:w-[500px]">
                    <div className="bg-white p-4 md:p-0">
                        <h2 className="text-3xl font-bold text-black mb-8">
                            Create an account
                        </h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-700 p-4 rounded mb-4 text-sm border border-green-200">
                                <p className="mb-1.5">{success}</p>
                                <p className="font-bold text-red-600 drop-shadow-sm">
                                    Please check your spam or junk folder if you do not see the email in your inbox.
                                </p>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSignup}>
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[13px] text-gray-600 flex items-center gap-1 font-medium">
                                    Full Name
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#4FA4D6] text-gray-900 placeholder-gray-400 bg-white"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-[13px] text-gray-600 block font-medium">
                                    E-mail Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#4FA4D6] text-gray-900 bg-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[13px] text-gray-600 flex items-center gap-1 font-medium">
                                    Password
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#4FA4D6] text-gray-900 bg-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[13px] text-gray-600 flex items-center gap-1 font-medium">
                                    Confirm Password
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#4FA4D6] text-gray-900 placeholder-gray-400 bg-white"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Privacy Policy */}
                            <div className="space-y-2 pt-2">
                                <label className="text-[13px] text-black font-medium block">
                                    Show privacy policy
                                </label>
                                <div className="flex items-start gap-2">
                                    <input
                                        id="privacy"
                                        name="privacy"
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 text-[#4FA4D6] focus:ring-[#4FA4D6] border-gray-300 rounded"
                                        checked={privacy}
                                        onChange={(e) => setPrivacy(e.target.checked)}
                                    />
                                    <label htmlFor="privacy" className="text-[13px] text-gray-500">
                                        Please confirm that you agree to our privacy policy
                                    </label>
                                </div>
                            </div>

                            {/* Register Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[4px] shadow-sm text-sm font-medium text-white bg-[#4FA4D6] hover:bg-[#3d8cb8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4FA4D6] disabled:opacity-50"
                                >
                                    {loading ? 'Creating Account...' : 'Register'}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center mt-8">
                                <p className="text-gray-600 text-[13px] font-bold">
                                    Have an account?{' '}
                                    <Link href="/login" className="text-black hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
