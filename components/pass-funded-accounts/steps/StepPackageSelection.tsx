import { CheckoutData } from "../CheckoutWizard";
import { CheckCircle, ShieldCheck } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepPackageSelection({ data, updateData, onNext, onBack }: Props) {

    const handleSelect = (type: "Standard Pass" | "Guaranteed Pass") => {
        updateData({ packageType: type });
    };

    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <ShieldCheck className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Service Package</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Select your protection level.
                </p>
            </div>

            <div className="space-y-3 sm:space-y-5 relative z-10">
                {/* Standard Pass */}
                <button
                    onClick={() => handleSelect("Standard Pass")}
                    className={`w-full text-left p-4 sm:p-8 rounded-xl sm:rounded-[1.5rem] border-2 transition-all duration-300 relative group ${data.packageType === "Standard Pass"
                        ? "border-slate-900 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        : "border-slate-100 bg-white"
                        }`}
                >
                    <div className="flex items-start gap-3 sm:gap-6">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${data.packageType === "Standard Pass" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"}`}>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-center w-full mb-1 sm:mb-3">
                                <div className={`font-black text-sm sm:text-xl tracking-tight transition-colors ${data.packageType === "Standard Pass" ? "text-white" : "text-slate-900"}`}>Standard Pass</div>
                                <div className={`text-sm sm:text-xl font-bold transition-colors ${data.packageType === "Standard Pass" ? "text-emerald-400" : "text-slate-900"}`}>
                                    {data.packageType === "Standard Pass" && data.price > 0 ? `$${data.price}` : ""}
                                </div>
                            </div>
                            <p className={`text-[10px] sm:text-sm font-medium leading-tight mb-2 sm:mb-5 transition-colors ${data.packageType === "Standard Pass" ? "text-slate-300" : "text-slate-500"}`}>
                                Professional evaluation passing service.
                            </p>
                            <ul className={`text-[9px] sm:text-xs space-y-1.5 sm:space-y-2.5 font-medium transition-colors hidden sm:block ${data.packageType === "Standard Pass" ? "text-slate-300" : "text-slate-500"}`}>
                                <li className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${data.packageType === "Standard Pass" ? "bg-white/40" : "bg-slate-300"}`}></div>Professional traders</li>
                                <li className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${data.packageType === "Standard Pass" ? "bg-white/40" : "bg-slate-300"}`}></div>30-60 day completion</li>
                            </ul>
                        </div>
                    </div>
                </button>

                {/* Guaranteed Pass */}
                <button
                    onClick={() => handleSelect("Guaranteed Pass")}
                    className={`w-full text-left p-4 sm:p-8 rounded-xl sm:rounded-[1.5rem] border-2 transition-all duration-300 relative group ${data.packageType === "Guaranteed Pass"
                        ? "border-slate-900 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        : "border-slate-100 bg-white"
                        }`}
                >
                    <div className="flex items-start gap-3 sm:gap-6">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${data.packageType === "Guaranteed Pass" ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-400"}`}>
                            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-center w-full mb-1 sm:mb-3">
                                <div className={`font-black text-sm sm:text-xl tracking-tight transition-colors ${data.packageType === "Guaranteed Pass" ? "text-white" : "text-slate-900"}`}>Guaranteed Pass</div>
                                <div className={`text-sm sm:text-xl font-bold transition-colors ${data.packageType === "Guaranteed Pass" ? "text-emerald-400" : "text-slate-900"}`}>
                                    {data.packageType === "Guaranteed Pass" && data.price > 0 ? `$${data.price}` : ""}
                                </div>
                            </div>
                            <p className={`text-[10px] sm:text-sm font-medium leading-tight mb-2 sm:mb-5 transition-colors ${data.packageType === "Guaranteed Pass" ? "text-slate-300" : "text-slate-500"}`}>
                                Full refund protection.
                            </p>
                            <ul className={`text-[9px] sm:text-xs space-y-1.5 sm:space-y-2.5 font-medium transition-colors hidden sm:block ${data.packageType === "Guaranteed Pass" ? "text-slate-300" : "text-slate-500"}`}>
                                <li className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${data.packageType === "Guaranteed Pass" ? "bg-emerald-400" : "bg-emerald-400"}`}></div>Priority execution</li>
                                <li className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${data.packageType === "Guaranteed Pass" ? "bg-white/40" : "bg-slate-300"}`}></div>Full refund if we fail</li>
                            </ul>
                        </div>
                    </div>
                </button>
            </div>

            <button
                onClick={onNext}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base"
                disabled={!data.packageType}
            >
                <span className="tracking-wide">Continue to Summary</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10"
            >
                Back to Scope
            </button>
        </div>
    );
}
