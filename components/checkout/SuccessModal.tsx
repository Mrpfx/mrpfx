'use client';

import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    title?: string;
}

export default function SuccessModal({ isOpen, onClose, message, title = "Registration Successful!" }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                    <ShieldCheck className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-dm-sans">{title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-[15px] font-medium">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] text-[16px]"
                >
                    Got it, thanks!
                </button>
            </div>
        </div>
    );
}
