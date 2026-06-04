import { Suspense } from 'react';
import ResourceAuthForm from '@/components/resource/ResourceAuthForm';

export default function RobotsPage() {
    return (
        <div className="min-h-screen bg-white text-[#666] font-sans">
            {/* Header Section with Mountain Divider */}
            <div className="relative bg-[#0762d9] pt-[160px] pb-[128px] overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-[3rem] font-[900] text-white mb-6 uppercase tracking-[4px] font-[family-name:var(--font-palanquin-dark)] leading-none drop-shadow-md">
                        FREE ROBOTS
                    </h1>
                    <div className="w-[80px] h-[3px] bg-[#52f28a] mx-auto"></div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg
                        className="relative block w-[calc(160%+1.3px)] h-[135px] transform -translate-x-1/2 rotate-y-180 left-1/2"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                            className="fill-[#EAF3FF29]"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Registration Form Section */}
            <div className="container mx-auto px-4 my-[50px] relative z-20">
                <Suspense fallback={<div />}>
                    <ResourceAuthForm title="Robots" />
                </Suspense>
            </div>
        </div>
    );
}
