'use client';

import { useState } from 'react';
import Hero from './Hero';
import AccessSection from './AccessSection';
import Services from './Services';
import TradingTools from './TradingTools';
import MentorshipPreview from './MentorshipPreview';
import Testimonials from './Testimonials';
import Community from './Community';
import TradingStrategy from './TradingStrategy';
import NewsletterSection from '../shared/NewsletterSection';
import OfferPopup from '../shared/OfferPopup';
import MentorshipModal from './MentorshipModal';
import ComingSoonModal from '../shared/ComingSoonModal';

export default function HomePage() {
    const [showMentorshipPopup, setShowMentorshipPopup] = useState(false);
    const [showVipPopup, setShowVipPopup] = useState(false);
    const [showFreePopup, setShowFreePopup] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);

    const mentorshipItems = [
        { label: "Standard Mentorship", href: "/mentorship-course", color: "purple" as const },
        { label: "One - On - One Class With Mr P", href: "https://wa.me/2349076804442", color: "purple" as const, isExternal: true },
        { label: "MC100", href: "/mentorship-course-100", color: "blue" as const }
    ];

    const vipItems = [
        { label: "VIP Bots", href: "/vip-trading-bots", color: "blue" as const },
        { label: "VIP Indicator", href: "/vip-trading-indicators", color: "purple" as const },
        { label: "All VIP Resources", href: "/all-vip-resources", color: "purple" as const }
    ];

    const freeItems = [
        { label: "Free Bots", href: "/free-robots", color: "blue" as const },
        { label: "Free Indicator", href: "/free-trading-indicators", color: "blue" as const },
        { label: "Free Mentorship videos", href: "/videos", color: "purple" as const },
        { label: "All Free Resources", href: "/free-signals-group", color: "purple" as const }
    ];

    return (
        <main className="min-h-screen bg-white">
            <Hero onMentorshipClick={() => setShowMentorshipPopup(true)} />
            <AccessSection
                onMentorshipClick={() => setShowMentorshipPopup(true)}
                onTradeJournalClick={() => setShowComingSoon(true)}
            />
            {/* <Services
                onMentorshipClick={() => setShowMentorshipPopup(true)}
                onVipClick={() => setShowVipPopup(true)}
                onFreeClick={() => setShowFreePopup(true)}
            /> */}
            {/* <TradingTools
                onMentorshipClick={() => setShowMentorshipPopup(true)}
                onVipClick={() => setShowVipPopup(true)}
                onFreeClick={() => setShowFreePopup(true)}
            /> */}
            {/* <MentorshipPreview /> */}
            <Testimonials />
            {/* <Community /> */}
            {/* <TradingStrategy /> */}
            <NewsletterSection />

            <MentorshipModal
                isOpen={showMentorshipPopup}
                onClose={() => setShowMentorshipPopup(false)}
            />
            <OfferPopup
                isOpen={showVipPopup}
                onClose={() => setShowVipPopup(false)}
                items={vipItems}
            />
            <OfferPopup
                isOpen={showFreePopup}
                onClose={() => setShowFreePopup(false)}
                items={freeItems}
            />
            <ComingSoonModal
                isOpen={showComingSoon}
                onClose={() => setShowComingSoon(false)}
            />
        </main>
    );
}
