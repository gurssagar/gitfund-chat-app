"use client";

import { Tabs } from "./tabs";

export function PricingTabs() {
    const tabs = [
        {
            title: "Contributer",
            value: "Contributer",
            content: (
                <div
                    className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-[#9D00FF] flex flex-col items-center gap-3">
                    <h1 className="text-[3.3vw] font-bold text-center">Ready to Turn Code into Money?</h1>
                    <p className="md:text-[1vw] text-[1.5vw] font-semibold text-center">Join a growing community of developers monetizing their open-source passion.</p>
                </div>
            ),
        },
        {
            title: "Maintainer",
            value: "Maintainer",
            content: (
                <div
                    className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-[#9D00FF] flex flex-col items-center gap-3">
                    <h1 className="text-[3.3vw] font-bold text-center">Boost Your Project, Attract Top Talent</h1>
                    <p className="md:text-[1vw] text-[2vw] font-semibold text-center">Create Bounties & Grow Your Community.</p>
                </div>
            ),
        }
    ];

    return (
        <div
            className="h-[22rem] md:h-[42rem] [perspective:1000px] relative b flex flex-col max-w-[80vw] mx-auto w-full  items-start justify-start my-30 z-20">
            <Tabs tabs={tabs} />
        </div>
    );
}
