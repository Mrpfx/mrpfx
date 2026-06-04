"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { propFirmService, PropFirmRegistration } from "@/services/prop-firm.service";
import { cryptoPaymentService } from "@/services/crypto-payment.service";
import { getCheckoutPrice } from "@/lib/pricing";
import { toast } from "react-hot-toast";

// Import all Steps
import { StepChooseFirm } from "./steps/StepChooseFirm";
import { StepChallengeType } from "./steps/StepChallengeType";
import { StepScope } from "./steps/StepScope";
import { StepAccountSize } from "./steps/StepAccountSize";
import { StepPackageSelection } from "./steps/StepPackageSelection";
import { StepTimelineRules } from "./steps/StepTimelineRules";
import { StepOrderSummary } from "./steps/StepOrderSummary";
import { StepMT5Details } from "./steps/StepMT5Details";
import { StepAdditionalInfo } from "./steps/StepAdditionalInfo";
import { StepLegal } from "./steps/StepLegal";
import { StepPayment } from "./steps/StepPayment";
import { StepSuccess } from "./steps/StepSuccess";
import { PricingTier } from "@/app/actions/prop-firm-settings";

export interface CheckoutData {
    // Pricing info
    propFirm: string;
    challengeType: "1-Step Challenge" | "2-Step Challenge";
    scope: "Step 1 Only" | "Full Pass" | "";
    accountSize: number;
    packageType: "Standard Pass" | "Guaranteed Pass" | "";
    price: number;
    vatPercentage: number;
    discountCode?: string;
    discountPercentage?: number;

    // Login Details
    propFirmCompany: string;
    loginId: string;
    password: string;
    serverName: string;

    // User Details & Contact
    whatsapp: string;
    telegram: string;
    notes: string;
    agreedToTerms: boolean;
    agreedToRefundPolicy: boolean;

    // Payment Selection
    paymentMethod: "card" | "crypto";
    cardPaymentUrl?: string;
    cryptoCurrency?: string;
}

const INITIAL_DATA: CheckoutData = {
    propFirm: "",
    challengeType: "2-Step Challenge",
    scope: "",
    accountSize: 0,
    packageType: "",
    price: 0,
    vatPercentage: 0,

    propFirmCompany: "",
    loginId: "",
    password: "",
    serverName: "",

    whatsapp: "",
    telegram: "",
    notes: "",
    paymentMethod: "crypto",
    cryptoCurrency: "usdttrc20",
    agreedToTerms: false,
    agreedToRefundPolicy: false,
};

function CheckoutWizardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState<CheckoutData>(INITIAL_DATA);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<string>("");
    const [isCheckingEntry, setIsCheckingEntry] = useState(true);
    const [pricingTiers, setPricingTiers] = useState<Record<string, PricingTier>>({});

    // 1. Restore state from sessionStorage on mount
    useEffect(() => {
        const saved = sessionStorage.getItem('checkout_wizard_state');
        if (saved) {
            try {
                const { data: savedData, currentStep: savedStep } = JSON.parse(saved);
                setData(savedData);
                setCurrentStep(savedStep);
            } catch (e) {
                console.error('Failed to restore checkout wizard state:', e);
            }
        }
    }, []);

    // 2. Persist state to sessionStorage on changes
    useEffect(() => {
        if (currentStep > 1 || data.propFirm !== "" || data.accountSize !== 0) {
            sessionStorage.setItem('checkout_wizard_state', JSON.stringify({ data, currentStep }));
        }
    }, [data, currentStep]);
    // 3. Main Init: URL Parsing & Entry Guard
    useEffect(() => {
        const planParam = searchParams.get('plan');
        const challengeParam = searchParams.get('challenge') || '';
        const typeParam = searchParams.get('type') || '';
        const sizeParam = searchParams.get('sizeVal');
        const priceParam = searchParams.get('price');

        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const saved = typeof window !== 'undefined' ? sessionStorage.getItem('checkout_wizard_state') : null;

        // --- ENFORCEMENT GUARDS ---

        // A. Direct URL access prevention
        if (!planParam && !saved) {
            console.log("No plan or saved session found. Redirecting to pass-funded-accounts.");
            router.push('/pass-funded-accounts');
            return;
        }

        // B. Authentication Check
        if (!token) {
            toast.error("Please login to continue with checkout");
            const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/login?redirect=${currentUrl}`);
            return;
        }

        // --- DATA INITIALIZATION ---

        if (planParam && priceParam && sizeParam) {
            const parsedSize = parseInt(sizeParam, 10);

            let challengeType: "1-Step Challenge" | "2-Step Challenge" = "2-Step Challenge";
            if (challengeParam.toLowerCase().includes('1-step')) challengeType = "1-Step Challenge";

            let scope: "Step 1 Only" | "Full Pass" = "Full Pass";
            if (typeParam.toLowerCase().includes('step 1 pass')) scope = "Step 1 Only";

            let packageType: "Standard Pass" | "Guaranteed Pass" = "Standard Pass";
            if (planParam.toLowerCase().includes('guarantee')) packageType = "Guaranteed Pass";

            const calculatedPrice = getCheckoutPrice(packageType, challengeType, scope, parsedSize);

            setData(prev => ({
                ...prev,
                challengeType,
                scope,
                accountSize: parsedSize,
                packageType,
                price: calculatedPrice
            }));

            // Step Skipping Logic: Skip to StepTimelineRules (Step 6)
            setCurrentStep(6);
        }

        // Fetch settings dynamically
        import('@/app/actions/prop-firm-settings').then(module => {
            module.getPropFirmSettings().then(settings => {
                if (settings) {
                    if (settings.discountActive) {
                        setData(prev => ({
                            ...prev,
                            discountPercentage: settings.discountPercentage || 0,
                        }));
                    }
                    if (settings.pricingTiers) {
                        setPricingTiers(settings.pricingTiers);
                    }
                }
            });
        });

        // We are good to go
        setIsCheckingEntry(false);
    }, [searchParams, router]);

    // Recalculate price dynamically if user modifies package options in wizard
    useEffect(() => {
        const planKey = data.packageType.toLowerCase().includes('guarantee') ? 'guaranteed' : 'standard';
        const challengeKey = data.challengeType.toLowerCase().includes('1-step') ? '1step' : '2step';
        const scopeKey = data.scope === "Step 1 Only" ? "step1" : "full";
        const tierKey = `${planKey}-${challengeKey}-${scopeKey}-${data.accountSize}`;

        const dynamicPrice = pricingTiers[tierKey]?.price;
        if (dynamicPrice) {
            setData(prev => ({ ...prev, price: dynamicPrice }));
        } else {
            const calculatedPrice = getCheckoutPrice(data.packageType, data.challengeType, data.scope, data.accountSize);
            if (calculatedPrice > 0 && calculatedPrice !== data.price) {
                setData(prev => ({ ...prev, price: calculatedPrice }));
            }
        }
    }, [data.packageType, data.challengeType, data.scope, data.accountSize, pricingTiers]);

    const updateData = (newData: Partial<CheckoutData>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const handleNext = () => {
        // Validation per step if needed
        if (currentStep === 2 && data.challengeType === "1-Step Challenge") {
            // For 1-Step, we skip the Scope selection (Step 3) since it's always "Full Pass"
            updateData({ scope: "Full Pass" });
            setCurrentStep(4);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        // Handle Back button with skipping logic
        if (currentStep === 4 && data.challengeType === "1-Step Challenge") {
            setCurrentStep(2); // Skip back over Step 3
        } else if (currentStep === 6 && searchParams.get('plan')) {
            // If we came from the pre-selected flow, don't allow going back to manual selections
            router.push('/pass-funded-accounts');
        } else {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async (paymentFlow: "invoice" | "direct" | "whop") => {
        setLoading(true);
        try {
            // 1. Calculate final amounts
            const discountPercentage = data.discountPercentage || 0;
            const discountedPrice = data.price * (1 - discountPercentage / 100);
            const vatAmount = discountedPrice * (data.vatPercentage || 0) / 100;
            const finalTotal = discountedPrice + vatAmount;

            // 2. Prepare payload for prop firm registration
            const payload = {
                login_id: data.loginId,
                password: data.password,
                propfirm_name: data.propFirmCompany || data.propFirm || "Selected via Pass Funded",
                propfirm_website_link: "N/A",
                server_name: data.serverName,
                server_type: "Metatrader 5 only",
                challenges_step: data.challengeType === "1-Step Challenge" ? 1 : 2,
                propfirm_account_cost: discountedPrice,
                account_size: data.accountSize,
                account_phases: data.scope === "Step 1 Only" ? 1 : (data.challengeType === "1-Step Challenge" ? 1 : 2),
                trading_platform: "Metatrader 5 only",
                propfirm_rules: `Package: ${data.packageType}\nNotes: ${data.notes}`,
                whatsapp_no: data.whatsapp,
                telegram_username: data.telegram,
                payment_method: data.paymentMethod // Added field
            };

            // 3. Register with backend
            const registration = await propFirmService.createRegistration(payload as PropFirmRegistration);
            const regId = registration.registration_id || (registration as any).id;

            // 4. Handle Payment Flow
            if (data.paymentMethod === "crypto") {
                const invoiceResponse = await cryptoPaymentService.createInvoice({
                    price_amount: finalTotal,
                    price_currency: "usd",
                    order_id: `PROP-${regId}`,
                    order_description: `Prop Firm Challenge - ${data.propFirm} ${data.accountSize}`,
                    success_url: `${window.location.origin}/pass-funded-accounts/checkout?step=success&order_id=PROP-${regId}`,
                    cancel_url: window.location.href
                });

                // Clear state on success
                sessionStorage.removeItem('checkout_wizard_state');

                if (invoiceResponse.invoice_url) {
                    window.location.href = invoiceResponse.invoice_url;
                    return;
                }

                // Fallback if no URL
                setOrderId(`PROP-${regId}`);
                setCurrentStep(13);
            } else {
                // Handle Card/Seller Redirection
                const planKey = data.packageType.toLowerCase().includes('guarantee') ? 'guaranteed' : 'standard';
                const challengeKey = data.challengeType.toLowerCase().includes('1-step') ? '1step' : '2step';
                const scopeKey = data.scope === "Step 1 Only" ? "step1" : "full";
                const tierKey = `${planKey}-${challengeKey}-${scopeKey}-${data.accountSize}`;
                let finalSellerLink = pricingTiers[tierKey]?.sellerLink?.trim();

                // Clear state on success
                sessionStorage.removeItem('checkout_wizard_state');

                if (finalSellerLink) {
                    if (!finalSellerLink.startsWith('http') && !finalSellerLink.startsWith('/')) {
                        finalSellerLink = 'https://' + finalSellerLink;
                    }
                    toast.success("Registration created! Redirecting to payment...");
                    setTimeout(() => {
                        window.location.href = finalSellerLink;
                    }, 1500);
                    return;
                }

                setOrderId(`PROP-${regId}`);
                toast.success("Registration created successfully!");
                setCurrentStep(13); // Final success
            }

        } catch (error: any) {
            console.error("Checkout failed:", error);
            if (error?.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                localStorage.removeItem('access_token');
                router.push('/login');
                return;
            }
            toast.error(error?.response?.data?.detail || error.message || "An error occurred during checkout");
        } finally {
            setLoading(false);
        }
    };


    // Calculate visible steps logic
    const skippedSteps = searchParams.get('plan') ? 5 : 0;
    const isStepSkipped = (step: number) => step <= skippedSteps;

    // Filter out skipped steps for progress bar
    const totalVisibleSteps = 13 - skippedSteps; // 13 total steps in our flow
    const visibleCurrentStep = currentStep > skippedSteps ? currentStep - skippedSteps : 1;

    if (isCheckingEntry) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-4" />
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Verifying Access...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen sm:min-h-screen bg-slate-50 text-slate-900 pt-0 pb-2 sm:py-12 px-2 sm:px-4 relative overflow-hidden font-sans flex items-start sm:items-center justify-center selection:bg-indigo-100 selection:text-indigo-900">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-2/3 h-2/3 rounded-full bg-indigo-500/[0.03] blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-full bg-emerald-500/[0.03] blur-[120px]" />
            </div>

            <div className="w-full max-w-3xl relative z-10 flex flex-col h-full max-h-[96vh] sm:max-h-none">
                {/* Progress Indicators */}
                {currentStep < 13 && (
                    <div className="w-full bg-white/80 backdrop-blur-md rounded-none sm:rounded-[2rem] shadow-[0_4px_15px_rgb(0,0,0,0.02)] border-b sm:border border-slate-100/50 flex flex-row items-center justify-between px-3 py-1.5 sm:px-8 sm:py-6 mb-1 sm:mb-6 transition-all duration-300">
                        <div className="flex flex-col gap-0.5 w-full sm:w-auto">
                            <div className="text-[9px] sm:text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                                Step {visibleCurrentStep}/{totalVisibleSteps}
                            </div>
                            <div className="w-full sm:w-64 h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5 shadow-inner">
                                <div
                                    className="h-full bg-slate-900 transition-all duration-700 ease-out rounded-full relative"
                                    style={{ width: `${(visibleCurrentStep / totalVisibleSteps) * 100}%` }}
                                >
                                </div>
                            </div>
                        </div>
                        {currentStep > 1 && !(currentStep === 6 && searchParams.get('plan')) && (
                            <button onClick={handleBack} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center font-bold group ml-4">
                                <span className="text-[10px] uppercase tracking-wider">Back</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Step Content */}
                {currentStep === 1 && <StepChooseFirm data={data} updateData={updateData} onNext={handleNext} />}
                {currentStep === 2 && <StepChallengeType data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 3 && <StepScope data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 4 && <StepAccountSize data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 5 && <StepPackageSelection data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 6 && <StepTimelineRules onNext={handleNext} onBack={handleBack} />}
                {currentStep === 7 && <StepOrderSummary data={data} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 8 && <StepMT5Details data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 9 && <StepAdditionalInfo data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 10 && <StepLegal data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                {currentStep === 11 && <StepPayment data={data} updateData={updateData} onSubmit={handleSubmit} onBack={handleBack} loading={loading} pricingTiers={pricingTiers} />}
                {currentStep === 13 && <StepSuccess orderId={orderId} />}
            </div>
        </div>
    );
}

export default function CheckoutWizard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
            </div>
        }>
            <CheckoutWizardContent />
        </Suspense>
    );
}
