'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    AlertTriangle,
    Settings,
    Ban,
    Check,
    X,
    ChevronDown,
    Loader2,
    ArrowRight,
    ShieldCheck,
    Database,
    CheckCircle2,
    Info
} from 'lucide-react';
import TradersSelectionModal from './TradersSelectionModal';
import { cartService } from '@/lib/cart';
import { productsService } from '@/lib/products';
import { authService } from '@/lib/auth';
import { tradersService } from '@/lib/traders';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'management' | 'copy-trading';
    data: {
        accountId: string;
        password: string;
        server: string;
        broker: string;
        capital?: number;
        manager?: string;
        fee: number;
        target?: number;
        slug: string;
    };
    onSuccess: (message: string) => void;
}

export default function ConfirmBeforePaymentModal({ isOpen, onClose, data, onSuccess, mode = 'management' }: Props) {
    const isCopyTrading = mode === 'copy-trading';
    const term = isCopyTrading ? 'Copy Trades' : 'Management';

    const [activeSection, setActiveSection] = useState<string | null>('risks');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const sections = [
        {
            id: 'risks',
            title: 'Service & Risks',
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            items: [
                { text: 'I understand profits are not guaranteed.', type: 'check' },
                { text: 'I accept that losses can occur.', type: 'check' },
                { text: 'Past performance does not guarantee future results.', type: 'check' },
                { text: 'I am using capital I can afford to risk.', type: 'check' },
            ]
        },
        {
            id: 'disclosures',
            title: `${term} Disclosures`,
            icon: Settings,
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            items: [
                { text: `I understand ${term.toLowerCase()} is handled by independent third-party traders.`, type: 'check' },
                { text: 'I understand Mr P Fx does not control trading decisions.', type: 'check' },
                { text: 'I acknowledge the traders act as independent contractors.', type: 'check' },
            ]
        },
        {
            id: 'rules',
            title: 'Important Rules',
            icon: Ban,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-500/10',
            items: [
                { text: 'No interference with trades.', type: 'cross' },
                { text: 'No password changes.', type: 'cross' },
                { text: 'No independent trading on account.', type: 'cross' },
                { text: 'No withdrawals during active cycle.', type: 'cross' },
            ]
        }
    ].filter(Boolean);

    // New items specifically for Copy Trading
    const safetyItems = [
        { text: 'Your funds remain in your broker account', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { text: 'No withdrawal access is granted', icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { text: 'You can stop the service anytime', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const risksItems = isCopyTrading ? [
        { text: 'I understand profits are not guaranteed.', type: 'check' },
        { text: 'I accept that losses can occur.', type: 'check' },
    ] : [
        { text: 'I understand profits are not guaranteed.', type: 'check' },
        { text: 'I accept that losses can occur.', type: 'check' },
        { text: 'Past performance does not guarantee future results.', type: 'check' },
        { text: 'I am using capital I can afford to risk.', type: 'check' },
    ];

    const rulesItems = isCopyTrading ? [
        { text: 'No interference with trades.', type: 'cross' },
        { text: 'No password changes.', type: 'cross' },
        { text: 'No withdrawals during active cycle.', type: 'cross' },
    ] : [
        { text: 'No interference with trades.', type: 'cross' },
        { text: 'No password changes.', type: 'cross' },
        { text: 'No independent trading on account.', type: 'cross' },
        { text: 'No withdrawals during active cycle.', type: 'cross' },
    ];

    const displaySections = [
        {
            id: 'risks',
            title: 'Service & Risks',
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            items: risksItems
        },
        !isCopyTrading && {
            id: 'disclosures',
            title: `${term} Disclosures`,
            icon: Settings,
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            items: [
                { text: `I understand ${term.toLowerCase()} is handled by independent third-party traders.`, type: 'check' },
                { text: 'I understand Mr P Fx does not control trading decisions.', type: 'check' },
                { text: 'I acknowledge the traders act as independent contractors.', type: 'check' },
            ]
        },
        {
            id: 'rules',
            title: 'Important Rules',
            icon: Ban,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-500/10',
            items: rulesItems
        }
    ].filter((s): s is any => !!s);

    const toggleSection = (id: string) => {
        setActiveSection(activeSection === id ? null : id);
    };

    const handleConfirmAndPay = async () => {
        if (!acceptedTerms) return;
        setSubmitting(true);
        setError('');
        try {
            // 1. Submit connection record to backend
            const connectionData = {
                accountId: data.accountId,
                password: data.password,
                server: data.server,
                broker: data.broker,
                capital: data.capital || 0,
                manager: data.manager || 'N/A',
                agreed: true
            };

            const connectRes = isCopyTrading
                ? await tradersService.connectCopyTrading({
                    accountId: data.accountId,
                    password: data.password,
                    server: data.server
                })
                : await tradersService.connectAccount(connectionData);

            if (!connectRes.success) {
                throw new Error(connectRes.message);
            }

            // 2. Fetch the actual WooCommerce product by slug
            const product = await productsService.getProductBySlug(data.slug);
            if (!product || !product.id) {
                throw new Error(`Product tier not Found: ${data.slug}`);
            }

            // 3. Add the correct tier product to cart
            const cartMeta: Record<string, string> = {
                'MT5 Account': data.accountId,
                'Broker': data.broker,
                'Fee/Subscription': `$${data.fee.toLocaleString()}${isCopyTrading ? '/mo' : ''}`
            };

            if (data.capital) cartMeta['Capital'] = `$${data.capital.toLocaleString()}`;
            if (data.manager) cartMeta['Manager'] = data.manager;
            if (isCopyTrading) cartMeta['Type'] = 'Copy Trading Subscription';

            await cartService.addToCart(product.id, 1, undefined, cartMeta);

            // 4. Trigger the Global Checkout Modal
            window.dispatchEvent(new CustomEvent('open-checkout', { detail: { method: 'seller' } }));

            // 5. Close this modal
            onClose();
        } catch (err: any) {
            console.error('Account management connection failed', err);
            setError(err?.message || 'Failed to initiate checkout. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-[480px] max-h-[85vh] sm:max-h-[80vh] bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-white px-8 pt-8 pb-4 text-center border-b border-gray-50 flex-shrink-0">
                    <h2 className="text-[22px] sm:text-[24px] font-bold text-[#2E7D32] mb-1 font-dm-sans leading-tight">Confirm Before Payment</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">Please review and confirm before proceeding.</p>

                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 custom-scrollbar">
                    <div className="space-y-3 sm:space-y-4">
                        {displaySections.map((section) => (
                            <div key={section.id} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 sm:w-10 sm:h-10 ${section.bgColor} rounded-xl flex items-center justify-center`}>
                                            <section.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${section.iconColor}`} />
                                        </div>
                                        <span className="font-bold text-[#1a1a1a] text-[15px] sm:text-[16px]">{section.title}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`transition-all duration-500 ease-in-out ${activeSection === section.id ? 'max-h-[400px] opacity-100 pb-4' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <ul className="px-5 space-y-2 sm:space-y-3">
                                        {section.items.map((item: any, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className={`mt-0.5 shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${item.type === 'check' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {item.type === 'check' ? <Check className="w-2.5 h-2.5 sm:w-3 h-3 stroke-[3px]" /> : <X className="w-2.5 h-2.5 sm:w-3 h-3 stroke-[3px]" />}
                                                </div>
                                                <span className="text-[13px] sm:text-[14px] text-gray-600 leading-snug">{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}


                        {/* See How Traders Are Selected - Only for Management */}
                        {!isCopyTrading && (
                            <button
                                onClick={() => setShowSelectionModal(true)}
                                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-white border-2 border-gray-100 rounded-2xl text-gray-600 font-bold text-[15px] hover:bg-gray-50 hover:border-blue-100 hover:text-blue-600 transition-all group"
                            >
                                <Info className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                See How Traders Are Selected
                            </button>
                        )}

                        <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                            <div className="flex items-center h-6">
                                <input
                                    id="modal-terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                                />
                            </div>
                            <label htmlFor="modal-terms" className="text-sm font-semibold text-[#1a1a1a] cursor-pointer select-none">
                                I accept all terms & conditions.
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 sm:px-8 py-4 sm:py-6 bg-gray-50/50 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={handleConfirmAndPay}
                        disabled={!acceptedTerms || submitting}
                        className={`w-full py-4 rounded-2xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-lg ${acceptedTerms && !submitting
                            ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-emerald-500/20 active:scale-[0.98]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    <p className="text-[10px] sm:text-[11px] text-center text-gray-400 font-medium italic mt-3">
                        You will be redirected to the secure payment portal.
                    </p>
                </div>
            </div>

            <TradersSelectionModal
                isOpen={showSelectionModal}
                onClose={() => setShowSelectionModal(false)}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}} />
        </div>
    );

    return createPortal(modalContent, document.body);
}
