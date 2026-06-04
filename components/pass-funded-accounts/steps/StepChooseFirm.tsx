import { CheckoutData } from "../CheckoutWizard";
import { Building2 } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
}

const FIRMS = [
    { id: "FundedNext", name: "FundedNext" },
    { id: "FundingPips", name: "FundingPips" },
    { id: "FTMO", name: "FTMO" },
];

export function StepChooseFirm({ data, updateData, onNext }: Props) {
    const handleSelect = (firm: string) => {
        updateData({ propFirm: firm });
    };

    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Building2 className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Select Prop Firm</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Firm you purchased from.
                </p>
            </div>

            <div className="space-y-2 sm:space-y-4 relative z-10 max-w-md mx-auto">
                {FIRMS.map((firm) => (
                    <button
                        key={firm.id}
                        onClick={() => handleSelect(firm.id)}
                        className={`w-full flex items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group ${data.propFirm === firm.id
                            ? "border-slate-900 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
                            : "border-slate-100 bg-white"
                            }`}
                    >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 transition-colors ${data.propFirm === firm.id ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"}`}>
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className={`text-xs sm:text-base font-bold transition-colors ${data.propFirm === firm.id ? "text-white" : "text-slate-700"}`}>{firm.name}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onNext}
                disabled={!data.propFirm}
                className="w-full mt-4 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base max-w-md mx-auto"
            >
                <span className="tracking-wide">Continue to Account Size</span>
            </button>
        </div>
    );
}
