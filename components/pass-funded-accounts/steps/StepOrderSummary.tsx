import { CheckoutData } from "../CheckoutWizard";

interface Props {
    data: CheckoutData;
    onNext: () => void;
    onBack: () => void;
}

export function StepOrderSummary({ data, onNext, onBack }: Props) {
    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Order Summary</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Review your challenge configuration.
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-100/80 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 space-y-4 sm:space-y-6 mb-4 sm:mb-8 relative z-10 shadow-sm">
                <div className="grid grid-cols-2 gap-y-3 sm:gap-y-6 gap-x-3 sm:gap-x-4">
                    <div>
                        <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Firm</div>
                        <div className="text-xs sm:text-base font-bold text-slate-900">{data.propFirm}</div>
                    </div>
                    <div>
                        <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Type</div>
                        <div className="text-xs sm:text-base font-bold text-slate-900">{data.challengeType}</div>
                    </div>
                    <div>
                        <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Scope</div>
                        <div className="text-xs sm:text-base font-bold text-slate-900">{data.scope || "Full Pass"}</div>
                    </div>
                    <div>
                        <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Size</div>
                        <div className="text-xs sm:text-base font-bold text-slate-900">${data.accountSize.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Package</div>
                        <div className="text-xs sm:text-base font-bold text-slate-900">{data.packageType}</div>
                    </div>
                </div>

                <div className="border-t border-slate-200/60 pt-3 sm:pt-6 mt-1 sm:mt-2 space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center text-[10px] sm:text-sm font-medium">
                        <div className="text-slate-500">Subtotal</div>
                        <div className="text-slate-900">${data.price.toLocaleString()}</div>
                    </div>
                    {data.discountPercentage !== undefined && data.discountPercentage > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] sm:text-sm font-medium text-emerald-600 bg-emerald-50/50 p-1.5 sm:p-2 -mx-1.5 sm:-mx-2 rounded-lg">
                                <div>Discount ({data.discountPercentage}%)</div>
                                <div>-${(data.price * (data.discountPercentage / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                            <div className="bg-emerald-50/50 border border-emerald-100 p-2 sm:p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                <div className="text-emerald-500 shrink-0">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                                <p className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-tight">
                                    Discount is active only when crypto payment is selected
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-end pt-3 sm:pt-5 border-t border-slate-200/60">
                        <div className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Total</div>
                        <div className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                            ${((data.price * (1 - (data.discountPercentage || 0) / 100)) * (1 + (data.vatPercentage || 0) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base"
            >
                <span className="tracking-wide">Continue to Details</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10"
            >
                Back to Package Selection
            </button>
        </div>
    );
}
