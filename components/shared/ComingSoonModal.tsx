'use client';

import React from 'react';
import { X, Clock, Bell } from 'lucide-react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
    isOpen,
    onClose,
    title = "Coming Soon",
    description = "We're working hard to bring you this feature. Stay tuned for updates!"
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-indigo-50"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-800" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 relative">
                        <Clock className="w-10 h-10 animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-sm">
                            <Bell className="w-3.5 h-3.5 animate-bounce" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>
                            {title}
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-[280px] mx-auto font-medium">
                            {description}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[#312E81] text-white font-bold rounded-xl hover:bg-indigo-900 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
                    >
                        Got It!
                    </button>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
                        Estimated Arrival: Unspecified
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;
