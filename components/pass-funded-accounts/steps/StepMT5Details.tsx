import { CheckoutData } from "../CheckoutWizard";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepMT5Details({ data, updateData, onNext, onBack }: Props) {
    const isValid = data.propFirmCompany && data.loginId.length > 3 && data.password.length > 3 && data.serverName.length > 3;

    return (
        <div className="bg-white p-3 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-3 sm:mb-10 relative z-10">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Info className="w-4 h-4 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-0.5 sm:mb-3 uppercase italic">MT5 Information</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Provide your credentials.
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

            <div className="bg-amber-50/80 border border-amber-200/50 rounded-xl p-2.5 mb-4 flex gap-3 items-start relative z-10">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 leading-tight font-medium">
                    Do not trade on this account. Interference voids benefits.
                </p>
            </div>

            <div className="space-y-3 relative z-10">
                <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Prop Firm Company</label>
                    <select
                        value={data.propFirmCompany}
                        onChange={(e) => updateData({ propFirmCompany: e.target.value })}
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
                    >
                        <option value="">Select Prop Firm</option>
                        <option value="FundedNext">FundedNext</option>
                        <option value="FTMO">FTMO</option>
                        <option value="Fundingpips">Fundingpips</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">MT5 Login ID</label>
                        <input
                            type="text"
                            value={data.loginId}
                            onChange={(e) => updateData({ loginId: e.target.value })}
                            placeholder="Login ID"
                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">MT5 Password</label>
                        <input
                            type="text"
                            value={data.password}
                            onChange={(e) => updateData({ password: e.target.value })}
                            placeholder="Password"
                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">MT5 Server</label>
                    <input
                        type="text"
                        value={data.serverName}
                        onChange={(e) => updateData({ serverName: e.target.value })}
                        placeholder="e.g. FundedNext-Server"
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                </div>
            </div>

            <div className="mt-4 sm:mt-8 flex items-start gap-4 p-3 sm:p-5 bg-indigo-50/50 rounded-xl sm:rounded-2xl border border-indigo-100/50 relative z-10 hidden sm:flex">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <p className="text-[10px] sm:text-xs text-indigo-900/80 font-medium leading-relaxed">
                    Your credentials are securely encrypted. We never share your information.
                </p>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full mt-3 sm:mt-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-3 relative z-10 group text-sm sm:text-base"
            >
                <span className="tracking-wide">Continue to Additional Info</span>
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
