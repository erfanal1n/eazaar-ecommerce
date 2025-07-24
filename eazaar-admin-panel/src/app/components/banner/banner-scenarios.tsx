'use client';
import React, { useState } from 'react';

interface BannerScenariosProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  scenarioData: any;
  onScenarioDataChange: (data: any) => void;
}

const BannerScenarios: React.FC<BannerScenariosProps> = ({
  selectedScenario,
  onScenarioChange,
  scenarioData,
  onScenarioDataChange
}) => {
  const scenarios = [
    { value: 'custom', label: 'Custom Design', description: 'Full manual control over all elements' },
    { value: 'discount', label: 'Discount Offer', description: 'Product discounts and sales' },
    { value: 'newProduct', label: 'New Product', description: 'Product launches and announcements' },
    { value: 'advertisement', label: 'Advertisement', description: 'Brand campaigns and promotions' }
  ];

  const handleScenarioChange = (scenario: string) => {
    onScenarioChange(scenario);
    // Initialize scenario-specific data
    const defaultData = getDefaultScenarioData(scenario);
    onScenarioDataChange(defaultData);
  };

  const getDefaultScenarioData = (scenario: string) => {
    switch (scenario) {
      case 'discount':
        return {
          enabled: true,
          discountPercentage: 20,
          originalPrice: 100,
          salePrice: 80,
          currency: '$',
          urgencyText: 'Limited Time Offer!',
          limitedQuantity: { enabled: false, remaining: 0, total: 0 },
          couponCode: { enabled: false, code: '', displayText: '' }
        };
      case 'newProduct':
        return {
          enabled: true,
          productName: '',
          launchDate: new Date(),
          isPreOrder: false,
          availabilityStatus: 'available',
          keyFeatures: [],
          badges: {
            newBadge: { enabled: true, text: 'NEW', color: '#ff4444', backgroundColor: '#ffffff' },
            limitedEdition: { enabled: false, text: 'LIMITED EDITION', color: '#ffffff', backgroundColor: '#gold' }
          },
          specifications: []
        };
      case 'advertisement':
        return {
          enabled: true,
          campaignName: '',
          brandName: '',
          campaignType: 'brand',
          callToActionType: 'visitWebsite',
          externalLinks: { website: '', socialMedia: {} },
          trackingPixels: []
        };
      default:
        return {};
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Banner Scenario</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.value}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedScenario === scenario.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleScenarioChange(scenario.value)}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                name="scenario"
                value={scenario.value}
                checked={selectedScenario === scenario.value}
                onChange={() => handleScenarioChange(scenario.value)}
                className="mr-3"
              />
              <h4 className="font-medium text-gray-900">{scenario.label}</h4>
            </div>
            <p className="text-sm text-gray-600">{scenario.description}</p>
          </div>
        ))}
      </div>

      {/* Scenario-specific configuration will be rendered here */}
      {selectedScenario !== 'custom' && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Scenario Configuration</h4>
          <p className="text-sm text-gray-600">
            Scenario-specific settings will be displayed here based on the selected type.
          </p>
        </div>
      )}
    </div>
  );
};

export default BannerScenarios;