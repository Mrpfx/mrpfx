import { CheckoutData } from "../CheckoutWizard";
import { Info, FileText } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepAdditionalInfo({ data, updateData, onNext, onBack }: Props) {
    // API requires whatsapp and telegram. I'll make them required here.
    const isValid = data.whatsapp.length > 3 && data.telegram.length > 3;

    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <FileText className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">Additional Info</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Provide contact details.
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

            <div className="space-y-3 relative z-10">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">WhatsApp *</label>
                        <input
                            type="text"
                            value={data.whatsapp}
                            onChange={(e) => updateData({ whatsapp: e.target.value })}
                            placeholder="+1..."
                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Telegram *</label>
                        <input
                            type="text"
                            value={data.telegram}
                            onChange={(e) => updateData({ telegram: e.target.value })}
                            placeholder="@..."
                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Notes (Optional)</label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => updateData({ notes: e.target.value })}
                        placeholder="Instructions for traders..."
                        rows={2}
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none resize-none"
                    />
                </div>
            </div>

            <div className="mt-4 sm:mt-8 flex items-start gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 relative z-10 transition-all duration-300 hover:bg-indigo-50 hidden sm:flex">
                <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                    <span className="font-bold text-indigo-900 block mb-1">Pro Tip</span>
                    Include information about your challenge rules.
                </p>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 sm:gap-3 relative z-10 group text-sm sm:text-base"
            >
                <span className="tracking-wide">Continue to Review</span>
            </button>

            <button
                onClick={onBack}
                className="w-full mt-1 sm:mt-4 py-1.5 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors text-[10px] sm:text-xs tracking-wide uppercase relative z-10"
            >
                Back to MT5 Details
            </button>
        </div>
    );
}
