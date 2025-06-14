'use client';

import { useState } from 'react';
import clsx from 'clsx';

const data = {
    contributers: [
        {
            title: 'Explore Bounties',
            desc: 'Browse a curated list of GitHub issues that have real crypto bounties attached.'
        },
        {
            title: 'Earn Instantly',
            desc: 'Once your pull request is reviewed and merged, Check claim your bounty. Just merge and earn.'
        },
        {
            title: 'Real Time Chat',
            desc: 'Built with modern web technologies and tools that help the contributer and the maintainer to talk about the project. *Maintainers choose whom to chat with.'
        },
        {
            title: 'Track Wallet',
            desc: 'Once you claim your bounty the money will be shown in your wallet.'
        }
    ],
    maintainers: [
        {
            title: 'Add Bounties',
            desc: 'Easily attach a crypto bounty to any GitHub issue from the GitFund dashboard or GitFund Github Bot.'
        },
        {
            title: 'Track Submissions',
            desc: 'Sit back and track contributor activity in real time. See who’s assigned, view submitted pull requests, and follow issue progress — all within GitFund’s dashboard.'
        },
        {
            title: 'Real Time Chat',
            desc: 'Built with modern web technologies and tools that help the contributer and the maintainer to talk about the project. *Maintainers choose whom to chat with.'
        },
        {
            title: 'Merge & Reward',
            desc: 'Once PR is reviewed and merged, approve the bounty to the contributor via dashboard or bot.'
        }
    ]
};

export default function Home() {
    const [active, setActive] = useState('contributers');
    const activeData = data[active];

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-8 flex flex-col items-center">
            <div className='bg-[#fff]/4 rounded-xl min-h-screen w-full flex flex-col items-center p-10'>
                <div className="flex gap-4 bg-[#404043] rounded-full max-w-[30vw] p-2 mb-10">
                    {['contributers', 'maintainers'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setActive(role)}
                            className={clsx(
                                'px-6 py-2 rounded-full text-lg font-medium capitalize transition-all',
                                active === role ? 'bg-[#2a2a2f]' : 'text-gray-400 hover:text-white'
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl">
                    {activeData.map((card, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl h-[48vh] shadow-lg bg-[#050505]/40 border border-white/10"
                        >
                            <h2 className="text-lg font-semibold mb-2 text-white">
                                {card.title}
                            </h2>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
}
