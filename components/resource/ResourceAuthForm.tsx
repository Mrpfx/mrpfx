'use client';

import { useState, useEffect } from 'react';
import { authService, User } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ResourceAuthFormProps {
    title: string;
}

const ResourceAuthForm = ({ title }: ResourceAuthFormProps) => {
    const [mode, setMode] = useState<'signup' | 'login'>('signup');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const storedUser = authService.getUserFromToken();
        if (storedUser) {
            setUser(storedUser);
        }

        const handleAuthChange = () => {
            setUser(authService.getUserFromToken());
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }

                await authService.signup({
                    email,
                    password,
                    username: email.split('@')[0],
                    display_name: fullName,
                });
                setSuccess('Account created successfully! Please check your email for verification.');
            } else {
                await authService.login({
                    login: email,
                    password: password,
                });
                // After login, authService dispatches auth-change which updates user state
            }
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('An account with this email already exists. Please try logging in or resetting your password.');
            } else {
                setError(err.response?.data?.message || err.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className="max-w-[600px] mx-auto bg-white p-8 rounded-lg text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#333]">Hi, {user.display_name || user.user_login}!</h3>
                <p className="text-gray-600">You are logged in and ready to access our resources.</p>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full bg-[#3ba1da] text-white h-[45px] rounded-[4px] font-bold hover:bg-[#44b0ec] transition-colors shadow-md"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[600px] mx-auto bg-white p-8 rounded-lg border border-gray-100 shadow-sm relative z-20">
            <h3 className="text-center text-xl font-bold text-[#555] mb-8 uppercase tracking-wide">
                {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm border border-red-100 italic">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded mb-6 text-[15px] border border-green-200">
                    <p className="mb-1.5">{success}</p>
                    <p className="font-bold text-red-600 drop-shadow-sm">
                        Please check your spam or junk folder if you do not see the email in your inbox.
                    </p>
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                    <div className="space-y-2">
                        <label className="block text-[15px] font-bold text-[#555]">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full h-[45px] px-3 border border-[#ddd] rounded-[2px] focus:outline-none focus:border-[#bbb] text-[#666]"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-[15px] font-bold text-[#555]">
                        E-mail Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        className="w-full h-[45px] px-3 border border-[#ddd] rounded-[2px] focus:outline-none focus:border-[#bbb] text-[#666]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-[15px] font-bold text-[#555]">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        className="w-full h-[45px] px-3 border border-[#ddd] rounded-[2px] focus:outline-none focus:border-[#bbb] text-[#666]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {mode === 'signup' && (
                    <div className="space-y-2">
                        <label className="block text-[15px] font-bold text-[#555]">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full h-[45px] px-3 border border-[#ddd] rounded-[2px] focus:outline-none focus:border-[#bbb] text-[#666] placeholder:text-[#aaa]"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: mode === 'signup' ? '#3ba1da' : '#efefef', color: mode === 'signup' ? 'white' : '#666' }}
                        className={`flex-1 h-[45px] font-bold text-[15px] rounded-[4px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {mode === 'signup' ? 'Register Now' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                        style={{ backgroundColor: mode === 'login' ? '#3ba1da' : '#efefef', color: mode === 'login' ? 'white' : '#666' }}
                        className={`flex-1 h-[45px] font-bold text-[15px] rounded-[4px] transition-all duration-200 shadow-sm flex items-center justify-center hover:opacity-90`}
                    >
                        {mode === 'signup' ? 'Login Instead' : 'Create Account'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResourceAuthForm;
