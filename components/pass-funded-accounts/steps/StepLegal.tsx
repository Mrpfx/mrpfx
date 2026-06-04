import { CheckoutData } from "../CheckoutWizard";
import { Info } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepLegal({ data, updateData, onNext, onBack }: Props) {
    const isValid = data.agreedToTerms && data.agreedToRefundPolicy;

    return (
        <div className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-4 sm:mb-10 relative z-10">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Info className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-3 uppercase italic">Legal & Terms</h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Please review and accept our service terms.
                </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-100/50 rounded-xl p-2.5 mb-3 flex gap-3 items-center relative z-10">
                <div className="flex-shrink-0">
                    <Info className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-[10px] text-amber-900/80 font-semibold leading-tight">
                    MT5 Only • Do Not Trade • 30-60 day target
                </span>
            </div>

            <div className="space-y-5 relative z-10">
                {/* Service Understanding */}
                <label className="block bg-slate-50/50 hover:bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-6 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${data.agreedToTerms ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 group-hover:border-slate-400"}`}>
                            {data.agreedToTerms && <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input type="checkbox" className="hidden" checked={data.agreedToTerms} onChange={(e) => updateData({ agreedToTerms: e.target.checked })} />
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1">Service Understanding</h3>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-normal sm:leading-relaxed">
                                Professional evaluation passing service. We trade on your account. <span className="text-slate-900 font-semibold italic">Service, not guarantee.</span>
                            </p>
                        </div>
                    </div>
                </label>

                {/* Terms */}
                <label className="block bg-slate-50/50 hover:bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-6 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${data.agreedToRefundPolicy ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 group-hover:border-slate-400"}`}>
                            {data.agreedToRefundPolicy && <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input type="checkbox" className="hidden" checked={data.agreedToRefundPolicy} onChange={(e) => updateData({ agreedToRefundPolicy: e.target.checked })} />
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1">{data.packageType || "Package"} Terms</h3>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-normal sm:leading-relaxed">
                                {data.packageType === "Standard Pass"
                                    ? "No refund protection included."
                                    : "Full refund protection included."
                                }
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base"
            >
                <span className="tracking-wide">Proceed to Checkout</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10"
            >
                Back to Additional Info
            </button>
        </div>
    );
}
