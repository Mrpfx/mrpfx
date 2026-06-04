import { CheckoutData } from "../CheckoutWizard";
import { Layers } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const TYPES = [
    { id: "2-Step Challenge", name: "2-Step Challenge", desc: "Complete Phase 1, then Phase 2 to get funded" },
    { id: "1-Step Challenge", name: "1-Step Challenge", desc: "Single evaluation phase to get funded" },
];

export function StepChallengeType({ data, updateData, onNext, onBack }: Props) {
    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Layers className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Challenge Type</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Select your structure.
                </p>
            </div>

            <div className="space-y-2 sm:space-y-4 relative z-10 max-w-md mx-auto">
                {TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => updateData({ challengeType: type.id as any })}
                        className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group ${data.challengeType === type.id
                            ? "border-slate-900 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
                            : "border-slate-100 bg-white"
                            }`}
                    >
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`mt-0.5 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${data.challengeType === type.id ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"}`}>
                                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <div className={`font-bold text-sm sm:text-lg mb-0.5 transition-colors ${data.challengeType === type.id ? "text-white" : "text-slate-900"}`}>{type.name}</div>
                                <div className={`text-[10px] sm:text-sm transition-colors ${data.challengeType === type.id ? "text-slate-400" : "text-slate-500"}`}>{type.desc}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={onNext}
                disabled={!data.challengeType}
                className="w-full mt-4 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base max-w-md mx-auto"
            >
                <span className="tracking-wide">Continue to Firm Selection</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10 max-w-md mx-auto block"
            >
                Back to Dashboard
            </button>
        </div>
    );
}
