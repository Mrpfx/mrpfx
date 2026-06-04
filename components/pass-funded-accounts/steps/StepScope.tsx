import { CheckoutData } from "../CheckoutWizard";
import { Target, CheckCircle2 } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepScope({ data, updateData, onNext, onBack }: Props) {
    const handleSelect = (scope: "Step 1 Only" | "Full Pass") => {
        updateData({ scope });
    };

    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Target className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Service Scope</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Select your evaluation phases.
                </p>
            </div>

            <div className="space-y-3 relative z-10 w-full max-w-md mx-auto">
                {/* Step 1 Only */}
                <button
                    onClick={() => handleSelect("Step 1 Only")}
                    className={`w-full text-left p-4 sm:p-7 rounded-xl sm:rounded-[1.5rem] border-2 transition-all duration-300 relative group ${data.scope === "Step 1 Only"
                        ? "border-slate-900 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        : "border-slate-100 bg-white"
                        }`}
                >
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${data.scope === "Step 1 Only" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"}`}>
                            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className={`font-black text-sm sm:text-lg tracking-tight mb-0.5 transition-colors ${data.scope === "Step 1 Only" ? "text-white" : "text-slate-900"}`}>Phase 1 Only</div>
                            <div className={`text-[10px] sm:text-sm font-medium transition-colors ${data.scope === "Step 1 Only" ? "text-slate-300" : "text-slate-500"}`}>Pass the first phase only</div>
                        </div>
                    </div>
                </button>

                {/* Full Pass */}
                <button
                    onClick={() => handleSelect("Full Pass")}
                    className={`w-full text-left p-4 sm:p-7 rounded-xl sm:rounded-[1.5rem] border-2 transition-all duration-300 relative group ${data.scope === "Full Pass"
                        ? "border-slate-900 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        : "border-slate-100 bg-white"
                        }`}
                >
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${data.scope === "Full Pass" ? "bg-white/10 text-emerald-400" : "bg-emerald-50 text-emerald-500"}`}>
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className={`font-black text-sm sm:text-lg tracking-tight mb-0.5 transition-colors ${data.scope === "Full Pass" ? "text-white" : "text-slate-900"}`}>Full Pass</div>
                            <div className={`text-[10px] sm:text-sm font-medium transition-colors ${data.scope === "Full Pass" ? "text-slate-300" : "text-slate-500"}`}>Both phases to get funded</div>
                        </div>
                    </div>
                </button>
            </div>

            <button
                onClick={onNext}
                disabled={!data.scope}
                className="w-full mt-3 sm:mt-10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group max-w-md mx-auto text-sm sm:text-base"
            >
                <span className="tracking-wide">Continue to Packages</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10 max-w-md mx-auto block"
            >
                Back to Account Size
            </button>
        </div>
    );
}
