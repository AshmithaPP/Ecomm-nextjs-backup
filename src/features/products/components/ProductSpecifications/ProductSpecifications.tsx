import React from 'react';
import SpecificationsTable from '../SpecificationsTable/SpecificationsTable';
import CareInstructions from '../CareInstructions/CareInstructions';
import './productSpecifications.css';

// Importing local icons correctly based on previous setup
import dropIcon from '../../../../assets/icons/ui/drop.png';
import flowerIcon from '../../../../assets/icons/ui/flower.png';
import coolIcon from '../../../../assets/icons/ui/cool.png';
import chemicalIcon from '../../../../assets/icons/ui/chemical.png';
import handIcon from '../../../../assets/icons/ui/hand.png';

interface SpecItem {
    label: string;
    value: string;
}

interface ProductSpecificationsProps {
    specifications: SpecItem[];
    services: any[];
    stats?: SpecItem[];
    originInfo?: any;
}

const ProductSpecifications = ({ specifications, services, stats, originInfo }: ProductSpecificationsProps) => {
    // Map API Data to Specifications format (new array structure)
    const specificationsData = [...(specifications || [])].map((item: SpecItem) => ({
        label: item.label,
        value: item.value
    }));

    // Add stats that are not wash/care related to specificationsData
    (stats || []).forEach((item: SpecItem) => {
        const labelLower = item.label.toLowerCase();
        const isCare = labelLower.includes('care') || labelLower.includes('wash');
        const exists = specificationsData.some(s => s.label.toLowerCase() === labelLower);
        if (!isCare && !exists) {
            specificationsData.push({
                label: item.label.charAt(0).toUpperCase() + item.label.slice(1),
                value: item.value
            });
        }
    });

    // Map API Data (stats with care/wash info) to care instructions format
    const careFromStats = (stats || []).filter((item: SpecItem) => {
        const labelLower = item.label.toLowerCase();
        return labelLower.includes('care') || labelLower.includes('wash');
    });
    
    const careInstructionsData = careFromStats.map((item: SpecItem) => ({
        text: `${item.label.charAt(0).toUpperCase() + item.label.slice(1)}: ${item.value}`
    }));

    const careWithIcons = careInstructionsData.map((item: any, index: number) => ({
        text: item.text,
        icon: [dropIcon, flowerIcon, coolIcon, chemicalIcon, handIcon][index % 5]
    }));

    // Map API Data (services) to shipping instructions format
    const shippingData = (services || []).map((item: any) => ({
        text: typeof item === 'object' ? (item.title || JSON.stringify(item)) : item
    }));

    const shippingWithIcons = shippingData.map((item: any, index: number) => ({
        text: item.text,
        icon: [dropIcon, flowerIcon, coolIcon, chemicalIcon, handIcon][index % 5]
    }));

    // Map API Data (originInfo) to authenticity instructions format
    const authenticityData: any[] = [];
    if (originInfo && Object.keys(originInfo).length > 0) {
        if (originInfo.heading) {
            authenticityData.push({ text: originInfo.heading });
        }
        if (originInfo.description) {
            authenticityData.push({ text: originInfo.description });
        }
    }

    const authenticityWithIcons = authenticityData.map((item: any, index: number) => ({
        text: item.text,
        icon: [dropIcon, flowerIcon, coolIcon, chemicalIcon, handIcon][index % 5]
    }));

    const hasTabsData = careWithIcons.length > 0 || shippingWithIcons.length > 0 || authenticityWithIcons.length > 0;

    return (
        <div className="product-specifications-section mt-2 mb-4 pb-4">
            <div className="product-specifications-wrapper d-flex flex-column">

                {/* Heading */}
                <h2 className="specifications-heading" style={{ fontSize: '20px', marginBottom: '15px' }}>Product Specifications</h2>

                {/* Specs Table */}
                <div className="specifications-table-container">
                    <SpecificationsTable specs={specificationsData} />
                </div>

                {/* Care Instructions Section */}
                {hasTabsData && (
                    <div className="care-instructions-container mt-3">
                        <CareInstructions 
                            careInstructions={careWithIcons}
                            shippingInstructions={shippingWithIcons}
                            authenticityInstructions={authenticityWithIcons} 
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductSpecifications;
