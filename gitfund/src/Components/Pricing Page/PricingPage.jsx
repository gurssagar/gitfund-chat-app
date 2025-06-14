import React from 'react'
import { PricingTabs } from './PricingTabs'
import Bg from './BgPricing';

const PricingPage = () => {
    return (
        <div>
            <div className="bg-[#09090b] w-full h-full overflow-x-hidden relative">
                <PricingTabs />
                <div className='absolute top-0 left-0 h-full'>
                    <Bg />
                </div>
            </div>
        </div>
    )
}

export default PricingPage
