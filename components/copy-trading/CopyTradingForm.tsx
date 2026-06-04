'use client';

import React, { useState } from 'react';
import { User, Lock, Server, Building2, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react';
import { tradersService } from '@/lib/traders';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { getCopyTradingSettings, CopyTradingSettings } from '@/app/actions/copy-trading-settings';
import ConfirmBeforePaymentModal from '../checkout/ConfirmBeforePaymentModal';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import SuccessModal from '../checkout/SuccessModal';

export default function CopyTradingForm({ onSuccess }: { onSuccess?: () => void }) {
    const [broker, setBroker] = useState('');
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [server, setServer] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [settings, setSettings] = useState<CopyTradingSettings>({ monthlyFee: 399, placeholder: 'Monthly Subscription Fee', productSlug: 'copy-trading-monthly' });

    const { withAuth } = useRequireAuth();

    React.useEffect(() => {
        getCopyTradingSettings().then(setSettings);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { accountId, password, server, broker };

        withAuth(async () => {
            if (!accountId || !password || !server || !broker) {
                toast.error("Please fill in all MT5 account details");
                return;
            }

            setShowConfirmModal(true);
        }, { key: 'connect-copy-trading', data: formData });
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-4 md:p-8 w-full max-w-[420px] relative z-10 transition-all">
            <h3 className="text-[#1a1a1a] font-outfit font-bold text-lg md:text-2xl leading-tight mb-4 md:mb-6">
                Connect Your MT5 Account <span className="text-gray-400">&</span> Start Earning
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Broker Name */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={broker}
                        onChange={(e) => setBroker(e.target.value)}
                        placeholder="Broker Name"
                        className="block w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3.5 border border-gray-100 rounded-xl text-gray-800 text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 bg-[#F9FBFF] transition-all"
                        required
                    />
                </div>

                {/* MT5 Login ID */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        placeholder="MT5 Login ID"
                        className="block w-full pl-9 md:pl-11 pr-10 md:pr-12 py-2.5 md:py-3.5 border border-gray-100 rounded-xl text-gray-800 text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 bg-[#F9FBFF] transition-all"
                        required
                    />
                </div>

                {/* MT5 Password */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="MT5 Password"
                        className="block w-full pl-9 md:pl-11 pr-10 md:pr-12 py-2.5 md:py-3.5 border border-gray-100 rounded-xl text-gray-800 text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 bg-[#F9FBFF] transition-all"
                        required
                    />
                </div>

                {/* Server */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none z-10">
                        <Server className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={server}
                        onChange={(e) => setServer(e.target.value)}
                        placeholder="Server"
                        className="block w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3.5 border border-gray-100 rounded-xl text-gray-800 text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 bg-[#F9FBFF] transition-all"
                        required
                    />
                </div>

                {/* Dynamic Fee Display */}
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex flex-col items-center group hover:bg-blue-50 transition-all duration-300">
                    <span className="text-[10px] uppercase font-bold text-blue-600/70 tracking-widest mb-1.5">Monthly Subscription</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-blue-900">${settings.monthlyFee.toLocaleString()}</span>
                        <span className="text-blue-600/50 font-bold text-sm">/ month</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-gradient-to-r from-[#00A859] to-[#00C853] hover:from-[#00914d] hover:to-[#00b249] disabled:opacity-50 text-white font-bold py-3 md:py-4 px-4 rounded-xl transition-all shadow-lg shadow-[#00A859]/20 flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                            <span className="text-xs md:text-lg">Processing...</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xs md:text-lg">Apply for Copy Trading</span>
                            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 opacity-80 group-hover:scale-110 transition-transform flex-shrink-0" />
                        </>
                    )}
                </button>
            </form>

            <ConfirmBeforePaymentModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                mode="copy-trading"
                onSuccess={(msg) => {
                    setSuccessMessage(msg);
                    setShowSuccessModal(true);
                    // Reset form
                    setAccountId('');
                    setPassword('');
                    setServer('');
                    setBroker('');
                    if (onSuccess) onSuccess();
                }}
                data={{
                    accountId,
                    password,
                    server,
                    broker,
                    fee: settings.monthlyFee,
                    slug: settings.productSlug
                }}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
        </div>
    );
}
