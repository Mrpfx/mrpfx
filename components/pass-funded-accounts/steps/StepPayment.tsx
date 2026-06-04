import { CheckoutData } from "../CheckoutWizard";
import { PricingTier } from "@/app/actions/prop-firm-settings";
import { Wallet, QrCode, Copy, Check, Info, RefreshCw, Bitcoin, CreditCard, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { cryptoPaymentService } from "@/services/crypto-payment.service";
import { toast } from "react-hot-toast";

interface Props {
    data: CheckoutData;
    updateData: (data: Partial<CheckoutData>) => void;
    onSubmit: (paymentFlow: "invoice" | "direct" | "whop") => void;
    onBack: () => void;
    loading: boolean;
    pricingTiers: Record<string, PricingTier>;
}

export function StepPayment({ data, updateData, onSubmit, onBack, loading, pricingTiers }: Props) {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("usdttrc20");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">(data.paymentMethod || "crypto");
    const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);
    const [showCardError, setShowCardError] = useState(false);

    const preferredCurrencies = ["btc", "usdttrc20", "eth", "ltc", "bnb", "trx", "usdc"];

    const discountPercentage = data.discountPercentage || 0;
    const discountedPrice = data.price * (1 - discountPercentage / 100);
    const vatAmount = discountedPrice * (data.vatPercentage || 0) / 100;
    const finalTotal = discountedPrice + vatAmount;

    useEffect(() => {
        loadCurrencies();
        // Ensure parent has the default selected currency
        if (!data.cryptoCurrency) {
            updateData({ cryptoCurrency: selectedCurrency });
        }
    }, []);

    useEffect(() => {
        if (selectedCurrency && finalTotal > 0) {
            loadEstimate();
        }
    }, [selectedCurrency, finalTotal]);

    const loadCurrencies = async () => {
        try {
            const response = await cryptoPaymentService.getAvailableCurrencies();
            const available = response.currencies || [];
            const sorted = [
                ...preferredCurrencies.filter((c: string) => available.includes(c)),
                ...available.filter((c: string) => !preferredCurrencies.includes(c))
            ];
            setCurrencies(sorted.length > 0 ? sorted : preferredCurrencies);
        } catch {
            setCurrencies(preferredCurrencies);
        } finally {
            setLoadingCurrencies(false);
        }
    };

    // Card functionality check
    const planKey = data.packageType.toLowerCase().includes('guarantee') ? 'guaranteed' : 'standard';
    const challengeKey = data.challengeType.toLowerCase().includes('1-step') ? '1step' : '2step';
    const scopeKey = data.scope === "Step 1 Only" ? "step1" : "full";
    const tierKey = `${planKey}-${challengeKey}-${scopeKey}-${data.accountSize}`;
    const cardLinkAvailable = !!pricingTiers[tierKey]?.sellerLink?.trim();

    useEffect(() => {
        if (paymentMethod === "card" && !cardLinkAvailable) {
            setPaymentMethod("crypto");
            updateData({ paymentMethod: "crypto" });
        }
        setShowCardError(false);
    }, [cardLinkAvailable, data.accountSize, data.packageType]);

    const loadEstimate = async () => {
        setLoadingEstimate(true);
        try {
            const response = await cryptoPaymentService.getEstimatedPrice(finalTotal, "usd", selectedCurrency);
            setEstimatedAmount(response.amount_to);
        } catch {
            setEstimatedAmount(null);
        } finally {
            setLoadingEstimate(false);
        }
    };

    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency);
        updateData({ cryptoCurrency: currency });
    };

    const handleCardClick = () => {
        if (!cardLinkAvailable) {
            setShowCardError(true);
            toast.error("Card payment link not set for this package.");
            return;
        }
        setPaymentMethod("card");
        updateData({ paymentMethod: "card" });
        setShowCardError(false);
    };

    return (
        <div className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="text-center mb-4 sm:mb-10 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Wallet className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-3">Choose Payment Method</h2>
                <p className="text-[10px] sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                    Select how you would like to pay for your prop firm challenge.
                </p>
            </div>

            {/* Payment Method Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 sm:mb-2 relative z-10">
                <button
                    onClick={handleCardClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${paymentMethod === "card"
                        ? "bg-white text-slate-900 shadow-sm"
                        : !cardLinkAvailable
                            ? "text-slate-400 opacity-50 cursor-pointer"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Card / Sellar
                </button>
                <button
                    onClick={() => { setPaymentMethod("crypto"); updateData({ paymentMethod: "crypto" }); setShowCardError(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${paymentMethod === "crypto" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <Bitcoin className="w-4 h-4" />
                    Crypto
                </button>
            </div>

            {/* Card Error Message */}
            {showCardError && (
                <div className="mt-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3">
                        <Info className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-[10px] sm:text-xs font-bold text-red-600">
                            Card payment link not set for this package. Please choose Crypto or contact support.
                        </p>
                    </div>
                </div>
            )}

            <div className={showCardError ? "" : "mt-4 sm:mt-8"}></div>

            {/* Price Card */}
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 rounded-[1.5rem] p-4 sm:p-8 mb-4 sm:mb-8 relative z-10 shadow-sm">
                <div className="flex justify-between items-center mb-4 text-slate-600 font-semibold text-sm">
                    <span>{data.accountSize} {data.packageType}</span>
                    <div className="text-right">
                        {discountPercentage > 0 && (
                            <span className="line-through text-slate-400 text-xs mr-2">${data.price.toFixed(2)}</span>
                        )}
                        <span className="text-slate-900">${discountedPrice.toFixed(2)}</span>
                    </div>
                </div>
                {discountPercentage > 0 && (
                    <div className="space-y-2 mb-3 -mx-2">
                        <div className="flex justify-between items-center text-emerald-600 font-medium text-sm bg-emerald-50/50 p-2 rounded-lg">
                            <span>Discount ({discountPercentage}%)</span>
                            <span>-${(data.price * (discountPercentage / 100)).toFixed(2)}</span>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                            <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-tight">
                                Discount is active only when crypto payment is selected
                            </p>
                        </div>
                    </div>
                )}
                {data.vatPercentage ? (
                    <div className="flex justify-between items-center mb-5 text-slate-500 font-medium text-sm">
                        <span>VAT ({data.vatPercentage}%)</span>
                        <span>${vatAmount.toFixed(2)}</span>
                    </div>
                ) : null}

                <div className="h-px bg-slate-100 mb-3 sm:mb-5" />

                <div className="flex justify-between items-end">
                    <div>
                        <span className="block text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-1.5">Total to Pay</span>
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">${finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {paymentMethod === "crypto" ? (
                <div className="mb-3 sm:mb-8 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-emerald-50/60 border border-emerald-100 p-3 sm:p-6 rounded-2xl flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                            <Bitcoin className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-[10px] sm:text-sm font-bold text-slate-900 uppercase tracking-tight">NOWPayments Gateway</h4>
                            <p className="text-[8px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-none">Choose from 50+ Coins</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">External Payment</h4>
                                <p className="text-[10px] text-slate-500 font-medium">Card, Apple Pay, Google Pay</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                            Complete your payment through our verified external partner (Sellar / Whop). After payment, your credentials will be processed automatically.
                        </p>
                    </div>
                </div>
            )}

            {paymentMethod === "crypto" ? (
                <button
                    onClick={() => onSubmit("invoice")}
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 sm:py-5 rounded-2xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-3 group relative z-10 text-sm sm:text-base"
                >
                    {loading ? (
                        <>
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            <span className="tracking-wide">Complete Purchase</span>
                        </>
                    )}
                </button>
            ) : (
                <button
                    onClick={() => onSubmit("direct")}
                    disabled={loading}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 sm:py-5 rounded-2xl sm:rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 group relative z-10 text-sm sm:text-base"
                >
                    {loading ? (
                        <>
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            <span className="tracking-wide">Continue to Payment</span>
                        </>
                    )}
                </button>
            )}

            <button
                onClick={onBack}
                disabled={loading}
                className="w-full mt-2 sm:mt-4 py-2 sm:py-3 text-slate-400 hover:text-slate-900 font-bold transition-colors disabled:opacity-50 text-[10px] sm:text-xs tracking-wide uppercase relative z-10"
            >
                Return to details
            </button>

            <div className="mt-4 sm:mt-8 text-center opacity-40 hover:opacity-100 transition-opacity relative z-10">
                <span className="text-[8px] sm:text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">
                    Secured by NOWPayments
                </span>
            </div>
        </div>
    );
}
