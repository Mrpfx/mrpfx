import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface Props {
    onNext: () => void;
    onBack: () => void;
}

export function StepTimelineRules({ onNext, onBack }: Props) {
    const [agreedTimeline, setAgreedTimeline] = useState(false);
    const [agreedNoTrading, setAgreedNoTrading] = useState(false);

    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Clock className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Timeline & Rules</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Please review and acknowledge our operational guidelines.
                </p>
            </div>

            <div className="space-y-5 relative z-10">
                {/* Timeline */}
                <label className="block bg-slate-50/50 hover:bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 pt-0.5 sm:pt-1">
                            <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                                <h3 className="text-xs sm:text-base font-bold text-slate-900">Timeline Expectations</h3>
                                <span className="bg-emerald-100 text-emerald-700 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md">Varies</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-normal sm:leading-relaxed">
                                30-60 trading day target window.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 sm:pt-4 border-t-2 border-slate-100 flex items-center gap-3 sm:gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${agreedTimeline ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 group-hover:border-slate-400"}`}>
                            {agreedTimeline && <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input type="checkbox" className="hidden" checked={agreedTimeline} onChange={(e) => setAgreedTimeline(e.target.checked)} />
                        <span className="text-xs sm:text-sm font-bold text-slate-700 select-none">I accept the timeline</span>
                    </div>
                </label>

                {/* No Trading Policy */}
                <label className="block bg-amber-50/30 hover:bg-amber-50/50 border-2 border-amber-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100/50 flex items-center justify-center flex-shrink-0 text-amber-500">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 pt-0.5 sm:pt-1">
                            <h3 className="text-xs sm:text-base font-bold text-amber-900 mb-0.5 sm:mb-1">Critical: No Trading Policy</h3>
                            <p className="text-[10px] sm:text-xs text-amber-800/70 font-medium leading-normal sm:leading-relaxed">
                                Any interference voids all guarantees.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 sm:pt-4 border-t-2 border-amber-100/50 flex items-center gap-3 sm:gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${agreedNoTrading ? "bg-amber-600 border-amber-600" : "bg-white border-amber-300 group-hover:border-amber-400"}`}>
                            {agreedNoTrading && <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input type="checkbox" className="hidden" checked={agreedNoTrading} onChange={(e) => setAgreedNoTrading(e.target.checked)} />
                        <span className="text-xs sm:text-sm font-bold text-amber-900/90 select-none">I will not trade on the account</span>
                    </div>
                </label>
            </div>

            <button
                onClick={onNext}
                disabled={!agreedTimeline || !agreedNoTrading}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base"
            >
                <span className="tracking-wide">Continue to Order Summary</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10"
            >
                Back to Details
            </button>
        </div>
    );
}
