'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PassFundedAccountsPage() {
    const [selections, setSelections] = useState<Record<number, number>>({
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    });

    const [discountActive, setDiscountActive] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [pricingTiers, setPricingTiers] = useState<any>({});

    useEffect(() => {
        import('@/app/actions/prop-firm-settings').then(module => {
            module.getPropFirmSettings().then(data => {
                setDiscountActive(data.discountActive || false);
                setDiscountPercentage(data.discountPercentage || 0);
                setPricingTiers(data.pricingTiers || {});
            });
        });
    }, []);

    const handleSelect = (cardIndex: number, itemIndex: number) => {
        setSelections(prev => ({ ...prev, [cardIndex]: itemIndex }));
    };

    const initialCards = [
        {
            title: "2-Step Challenge",
            type: "Step 1 Pass Only",
            plan: "Guaranteed",
            description: "Best for traders who want help clearing the first stage. We handle Step 1 only. After passing, control is returned to you.",
            items: [
                { label: '$50k Account', price: '$800', amount: '800', numericSize: '50000' },
                { label: '$100k Account', price: '$1200', amount: '1200', numericSize: '100000' },
                { label: '$200k Account', price: '$1700', amount: '1700', numericSize: '200000' },
                { label: '$500k Account', price: '$2500', amount: '2500', numericSize: '500000' }
            ]
        },
        {
            title: "2-Step Challenge",
            type: "Full (Step 1 + Step 2)",
            plan: "Guaranteed",
            description: "Best for traders who want the entire challenge completed. We complete both Step 1 and Step 2, then return the passed account to you.",
            mostChosen: true,
            items: [
                { label: '$50k Account', price: '$1100', amount: '1100', numericSize: '50000' },
                { label: '$100k Account', price: '$1600', amount: '1600', numericSize: '100000' },
                { label: '$200k Account', price: '$2200', amount: '2200', numericSize: '200000' },
                { label: '$500k Account', price: '$3200', amount: '3200', numericSize: '500000' }
            ]
        },
        {
            title: "1-Step Challenge",
            type: "Full",
            plan: "Guaranteed",
            description: "Best for firms with single-phase challenges. We complete the entire 1-Step challenge in one structured phase.",
            items: [
                { label: '$50k Account', price: '$1400', amount: '1400', numericSize: '50000' },
                { label: '$100k Account', price: '$1900', amount: '1900', numericSize: '100000' },
                { label: '$200k Account', price: '$2600', amount: '2600', numericSize: '200000' },
                { label: '$500k Account', price: '$3800', amount: '3800', numericSize: '500000' }
            ]
        },
        {
            title: "2-Step Challenge",
            type: "Step 1 Pass Only",
            plan: "Standard",
            description: "Best for traders who want help clearing the first stage. We handle Step 1 only. After passing, control is returned to you.",
            items: [
                { label: '$50k Account', price: '$490', amount: '490', numericSize: '50000' },
                { label: '$100k Account', price: '$690', amount: '690', numericSize: '100000' },
                { label: '$200k Account', price: '$990', amount: '990', numericSize: '200000' },
                { label: '$300k Account', price: '$1390', amount: '1390', numericSize: '300000' },
                { label: '$500k Account', price: '$1790', amount: '1790', numericSize: '500000' }
            ]
        },
        {
            title: "2-Step Challenge",
            type: "Full (Step 1 + Step 2)",
            plan: "Standard",
            description: "Best for traders who want the entire challenge completed. We complete both Step 1 and Step 2, then return the passed account to you.",
            mostChosen: true,
            items: [
                { label: '$50k Account', price: '$650', amount: '650', numericSize: '50000' },
                { label: '$100k Account', price: '$850', amount: '850', numericSize: '100000' },
                { label: '$200k Account', price: '$1290', amount: '1290', numericSize: '200000' },
                { label: '$500k Account', price: '$1790', amount: '1790', numericSize: '500000' }
            ]
        },
        {
            title: "1-Step Challenge",
            type: "Full",
            plan: "Standard",
            description: "Best for firms with single-phase challenges. We complete the entire 1-Step challenge in one structured phase.",
            items: [
                { label: '$50k Account', price: '$1400', amount: '1400', numericSize: '50000' },
                { label: '$100k Account', price: '$1900', amount: '1900', numericSize: '100000' },
                { label: '$200k Account', price: '$2600', amount: '2600', numericSize: '200000' },
                { label: '$500k Account', price: '$3800', amount: '3800', numericSize: '500000' }
            ]
        }
    ];

    // Merge dynamic prices
    const cards = initialCards.map(card => ({
        ...card,
        items: card.items.map(item => {
            const planKey = card.plan.toLowerCase().includes('guarantee') ? 'guaranteed' : 'standard';
            const challengeKey = card.title.toLowerCase().includes('1-step') ? '1step' : '2step';
            const scopeKey = card.type.toLowerCase().includes('step 1 pass') ? 'step1' : 'full';
            const tierKey = `${planKey}-${challengeKey}-${scopeKey}-${item.numericSize}`;

            const dynamicPrice = pricingTiers[tierKey]?.price;
            if (dynamicPrice) {
                return {
                    ...item,
                    price: `$${dynamicPrice}`,
                    amount: dynamicPrice.toString()
                };
            }
            return item;
        })
    }));


    return (
        <div className="min-h-screen bg-[#e6e9f5] font-sans font-dm-sans relative overflow-hidden flex flex-col items-center pt-[120px] pb-24">

            {/* Background elements omitted for brevity, keeping existing logic */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#e8eaf6] to-[#d6d9ea] opacity-80" />
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[400px] bg-purple-300/30 blur-[100px] mix-blend-multiply rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[300px] bg-indigo-300/30 blur-[120px] mix-blend-multiply rounded-full" />
                <div className="absolute top-[50%] left-[40%] w-[800px] h-[200px] bg-orange-200/20 blur-[80px] mix-blend-overlay rounded-full" />
                <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-white/40 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-[48px] font-bold text-[#2A2A72] mb-6 font-palanquin-dark tracking-tight leading-tight">
                    Pass Funded Accounts
                </h1>

                <p className="text-[17px] md:text-[18px] text-[#4b5563] max-w-[800px] leading-relaxed mb-8">
                    With a direct partnership with <span className="font-semibold text-[#2563EB]">PROPFIRMSOL.COM</span>, you can now pass your prop firm challenges and get fully funded within a few days. PropSol also grants you full access to their automated system after account is passed.
                </p>

                {/*{discountActive && discountPercentage > 0 && (
                    <div className="mb-12 inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 px-6 py-3 rounded-2xl">
                        <span className="text-xl">🎉</span>
                        <span className="text-red-600 font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                            SPECIAL OFFER: {discountPercentage}% OFF ALL CHALLENGES!
                        </span>
                    </div>
                )} */}

                <div className="w-full max-w-6xl mx-auto flex flex-col gap-24">
                    {/* Guaranteed Pass Section */}
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2A2A72] mb-2 font-palanquin-dark tracking-tight">Guaranteed Pass</h2>
                        <p className="text-sm md:text-base text-[#4b5563] mb-10 font-medium">Full refund if we don't pass your evaluation</p>

                        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-5xl mx-auto">
                            {cards.slice(0, 3).map((card, cardIdx) => (
                                <div key={cardIdx} className={`${card.mostChosen ? 'bg-[#2a2b53] border-[#5c6bc0] border-[1.5px] transform md:-translate-y-4 shadow-xl' : 'bg-[#e8ebfb] shadow-sm'} rounded-xl overflow-hidden flex flex-col relative`}>
                                    {card.mostChosen && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#5c6bc0] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-b-lg flex items-center gap-1.5 z-10 w-max">
                                            MOST CHOSEN <span className="text-sm">👍</span>
                                        </div>
                                    )}
                                    <div className={`p-6 md:p-8 ${card.mostChosen ? 'pt-12' : ''} text-left flex flex-col flex-1`}>
                                        <h4 className={`${card.mostChosen ? 'text-white' : 'text-[#2e377f]'} text-xl font-bold tracking-tight mb-1`}>{card.title}</h4>
                                        <p className={`${card.mostChosen ? 'text-[#a5b4fc]' : 'text-[#5c6bc0]'} text-[15px] font-medium mb-4`}>{card.type}</p>
                                        <p className={`${card.mostChosen ? 'text-[#cbd5e1]' : 'text-[#4b5563]'} text-[13px] leading-relaxed mb-8`}>{card.description}</p>

                                        <div className={`flex justify-between items-baseline mb-4 pb-2 border-b ${card.mostChosen ? 'border-white/10' : 'border-gray-300/50'}`}>
                                            <span className="text-[#64748b] font-bold text-[11px] uppercase tracking-wider">Account</span>
                                            <span className="text-[#64748b] font-bold text-[11px] uppercase tracking-wider">Pricing</span>
                                        </div>
                                        <ul className="space-y-3 mb-10">
                                            {card.items.map((item, i) => {
                                                const originalAmount = parseInt(item.amount);
                                                const isDiscounted = discountActive && discountPercentage > 0;
                                                const discountedAmount = isDiscounted ? Math.floor(originalAmount * (1 - discountPercentage / 100)) : originalAmount;
                                                const displayDiscountedPrice = `$${discountedAmount}`;

                                                return (
                                                    <li
                                                        key={i}
                                                        onClick={() => handleSelect(cardIdx, i)}
                                                        className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all ${selections[cardIdx] === i
                                                            ? (card.mostChosen ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white shadow-sm ring-1 ring-[#5c6bc0]/30')
                                                            : 'hover:bg-black/5'
                                                            }`}
                                                    >
                                                        <span className={`${card.mostChosen ? 'text-[#e2e8f0]' : 'text-[#334155]'} text-[15px] font-medium`}>{item.label}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`${card.mostChosen ? 'bg-white text-[#2a2b53]' : 'bg-[#5c6bc0] text-white'} font-bold text-sm px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5`}>
                                                                {isDiscounted && (
                                                                    <span className="line-through text-[11px] opacity-70">
                                                                        {item.price}
                                                                    </span>
                                                                )}
                                                                <span>{isDiscounted ? displayDiscountedPrice : item.price}</span>
                                                            </span>
                                                            {selections[cardIdx] === i && <Check className={`w-4 h-4 ${card.mostChosen ? 'text-[#a5b4fc]' : 'text-[#5c6bc0]'}`} />}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        <Link
                                            href={`/pass-funded-accounts/checkout?plan=${card.plan}&challenge=${encodeURIComponent(card.title)}&type=${encodeURIComponent(card.type)}&size=${encodeURIComponent(card.items[selections[cardIdx]].label)}&sizeVal=${card.items[selections[cardIdx]].numericSize}&price=${card.items[selections[cardIdx]].amount}`}
                                            className="w-full bg-[#5c6bc0] hover:bg-[#4f5baf] text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-md text-center block text-[15px] mt-auto"
                                        >
                                            Select {card.items[selections[cardIdx]].label}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Standard Pass Section */}
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2A2A72] mb-2 font-palanquin-dark tracking-tight">Standard Pass</h2>
                        <p className="text-sm md:text-base text-[#4b5563] mb-10 font-medium">Professional evaluation passing service - No Refund Guarantee</p>

                        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-5xl mx-auto">
                            {cards.slice(3, 6).map((card, idx) => {
                                const cardIdx = idx + 3;
                                return (
                                    <div key={cardIdx} className={`${card.mostChosen ? 'bg-[#2a2b53] border-[#5c6bc0] border-[1.5px] transform md:-translate-y-4 shadow-xl' : 'bg-[#e8ebfb] shadow-sm'} rounded-xl overflow-hidden flex flex-col relative`}>
                                        {card.mostChosen && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#5c6bc0] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-b-lg flex items-center gap-1.5 z-10 w-max">
                                                MOST CHOSEN <span className="text-sm">👍</span>
                                            </div>
                                        )}
                                        <div className={`p-6 md:p-8 ${card.mostChosen ? 'pt-12' : ''} text-left flex flex-col flex-1`}>
                                            <h4 className={`${card.mostChosen ? 'text-white' : 'text-[#2e377f]'} text-xl font-bold tracking-tight mb-1`}>{card.title}</h4>
                                            <p className={`${card.mostChosen ? 'text-[#a5b4fc]' : 'text-[#5c6bc0]'} text-[15px] font-medium mb-4`}>{card.type}</p>
                                            <p className={`${card.mostChosen ? 'text-[#cbd5e1]' : 'text-[#4b5563]'} text-[13px] leading-relaxed mb-8`}>{card.description}</p>

                                            <div className={`flex justify-between items-baseline mb-4 pb-2 border-b ${card.mostChosen ? 'border-white/10' : 'border-gray-300/50'}`}>
                                                <span className="text-[#64748b] font-bold text-[11px] uppercase tracking-wider">Account</span>
                                                <span className="text-[#64748b] font-bold text-[11px] uppercase tracking-wider">Pricing</span>
                                            </div>
                                            <ul className="space-y-3 mb-10">
                                                {card.items.map((item, i) => {
                                                    const originalAmount = parseInt(item.amount);
                                                    const isDiscounted = discountActive && discountPercentage > 0;
                                                    const discountedAmount = isDiscounted ? Math.floor(originalAmount * (1 - discountPercentage / 100)) : originalAmount;
                                                    const displayDiscountedPrice = `$${discountedAmount}`;

                                                    return (
                                                        <li
                                                            key={i}
                                                            onClick={() => handleSelect(cardIdx, i)}
                                                            className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all ${selections[cardIdx] === i
                                                                ? (card.mostChosen ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white shadow-sm ring-1 ring-[#5c6bc0]/30')
                                                                : 'hover:bg-black/5'
                                                                }`}
                                                        >
                                                            <span className={`${card.mostChosen ? 'text-[#e2e8f0]' : 'text-[#334155]'} text-[15px] font-medium`}>{item.label}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`${card.mostChosen ? 'bg-white text-[#2a2b53]' : 'bg-[#5c6bc0] text-white'} font-bold text-sm px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5`}>
                                                                    {isDiscounted && (
                                                                        <span className="line-through text-[11px] opacity-70">
                                                                            {item.price}
                                                                        </span>
                                                                    )}
                                                                    <span>{isDiscounted ? displayDiscountedPrice : item.price}</span>
                                                                </span>
                                                                {selections[cardIdx] === i && <Check className={`w-4 h-4 ${card.mostChosen ? 'text-[#a5b4fc]' : 'text-[#5c6bc0]'}`} />}
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                            <Link
                                                href={`/pass-funded-accounts/checkout?plan=${card.plan}&challenge=${encodeURIComponent(card.title)}&type=${encodeURIComponent(card.type)}&size=${encodeURIComponent(card.items[selections[cardIdx]].label)}&sizeVal=${card.items[selections[cardIdx]].numericSize}&price=${card.items[selections[cardIdx]].amount}`}
                                                className="w-full bg-[#5c6bc0] hover:bg-[#4f5baf] text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-md text-center block text-[15px] mt-auto"
                                            >
                                                Select {card.items[selections[cardIdx]].label}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="w-full max-w-4xl mx-auto mt-16 text-left px-4">
                    <p className="text-sm text-[#475569] font-medium">
                        <span className="font-bold text-[#1e293b]">Disclaimer:</span> All account passing process is solely handled by <span className="font-bold italic text-[#2A2A72]">PROPFIRMSOL.COM</span>.
                        <br />
                        Mr P Fx will receive a commission for every account passed.
                    </p>
                </div>
            </div>
        </div>
    );
}
