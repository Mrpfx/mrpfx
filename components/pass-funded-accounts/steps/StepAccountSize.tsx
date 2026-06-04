import { CheckoutData } from "../CheckoutWizard";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const SIZES = [50000, 100000, 200000, 500000];

export function StepAccountSize({ data, updateData, onNext, onBack }: Props) {
    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Account Size</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Choose evaluation size.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10 max-w-md mx-auto">
                {SIZES.map((size) => (
                    <button
                        key={size}
                        onClick={() => updateData({ accountSize: size })}
                        className={`p-4 sm:p-8 rounded-xl sm:rounded-[2rem] border-2 transition-all duration-300 group flex flex-col items-center justify-center ${data.accountSize === size
                            ? "border-slate-900 bg-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                            : "border-slate-100 bg-white"
                            }`}
                    >
                        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 sm:mb-1 transition-colors ${data.accountSize === size ? "text-slate-400" : "text-slate-400"}`}>$</span>
                        <span className={`text-sm sm:text-2xl font-black tracking-tighter transition-colors ${data.accountSize === size ? "text-white" : "text-slate-900"}`}>${size.toLocaleString()}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onNext}
                disabled={!data.accountSize}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base max-w-md mx-auto"
            >
                <span className="tracking-wide">Continue to Scope</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10 max-w-md mx-auto block"
            >
                Back to Challenge Type
            </button>
        </div>
    );
}
