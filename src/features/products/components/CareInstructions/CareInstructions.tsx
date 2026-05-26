"use client";

import React, { useState } from 'react';
import './careInstructions.css';
import Image from 'next/image';

interface Instruction {
    text: string;
    icon?: any;
}

interface CareInstructionsProps {
    careInstructions: Instruction[];
    shippingInstructions: Instruction[];
    authenticityInstructions: Instruction[];
}

const CareInstructions = ({ 
    careInstructions = [], 
    shippingInstructions = [], 
    authenticityInstructions = [] 
}: CareInstructionsProps) => {
    const showCare = careInstructions.length > 0;
    const showShipping = shippingInstructions.length > 0;
    const showAuthenticity = authenticityInstructions.length > 0;

    const [activeTab, setActiveTab] = useState<'care' | 'shipping' | 'authenticity'>(
        showCare ? 'care' : (showShipping ? 'shipping' : 'authenticity')
    );

    if (!showCare && !showShipping && !showAuthenticity) return null;

    const activeInstructions = activeTab === 'care'
        ? careInstructions
        : (activeTab === 'shipping' ? shippingInstructions : authenticityInstructions);

    return (
        <div className="care-instructions-wrapper w-100">
            {/* Tabs Row */}
            <div className="care-tabs d-flex">
                {showCare && (
                    <button 
                        type="button"
                        className={`care-tab border-0 bg-transparent p-0 ${activeTab === 'care' ? 'active-tab' : 'inactive-tab'}`}
                        onClick={() => setActiveTab('care')}
                    >
                        Care Instructions
                    </button>
                )}
                {showShipping && (
                    <button 
                        type="button"
                        className={`care-tab border-0 bg-transparent p-0 ${activeTab === 'shipping' ? 'active-tab' : 'inactive-tab'} ms-4`}
                        onClick={() => setActiveTab('shipping')}
                    >
                        Shipping & Returns
                    </button>
                )}
                {showAuthenticity && (
                    <button 
                        type="button"
                        className={`care-tab border-0 bg-transparent p-0 ${activeTab === 'authenticity' ? 'active-tab' : 'inactive-tab'} ms-4`}
                        onClick={() => setActiveTab('authenticity')}
                    >
                        Authenticity
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div className="care-content mt-4">
                <ul className="care-list list-unstyled m-0">
                    {activeInstructions.map((item, index) => (
                        <li key={index} className="care-item d-flex align-items-center mb-3">
                            {item.icon && <Image src={item.icon} alt="Tab Icon" className="care-icon me-3" width={24} height={24} />}
                            <span className="care-text">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CareInstructions;
