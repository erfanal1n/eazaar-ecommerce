'use client';
import React, { useState } from 'react';

interface EnhancedBannerScenariosProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  scenarioData: any;
  onScenarioDataChange: (data: any) => void;
  visibility: any;
  onVisibilityChange: (visibility: any) => void;
  template: any;
  onTemplateChange: (template: any) => void;
}

const EnhancedBannerScenarios: React.FC<EnhancedBannerScenariosProps> = ({
  selectedScenario,
  onScenarioChange,
  scenarioData,
  onScenarioDataChange,
  visibility,
  onVisibilityChange,
  template,
  onTemplateChange
}) => {
  const [activeTab, setActiveTab] = useState('scenario');

  const scenarios = [
    { 
      value: 'custom', 
      label: 'Custom Design', 
      description: 'Full manual control over all elements',
      icon: 'Custom'
    },
    { 
      value: 'discount', 
      label: 'Discount Offer', 
      description: 'Product discounts and sales',
      icon: 'Sale'
    },
    { 
      value: 'newProduct', 
      label: 'New Product', 
      description: 'Product launches and announcements',
      icon: 'New'
    },
    { 
      value: 'advertisement', 
      label: 'Advertisement', 
      description: 'Brand campaigns and promotions',
      icon: 'Ad'
    }
  ];

  const handleScenarioChange = (scenario: string) => {
    onScenarioChange(scenario);
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

  const renderVisibilityControls = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Element Visibility</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(visibility || {}).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onVisibilityChange({
                ...visibility,
                [key]: e.target.checked
              })}
              className="mr-2"
            />
            <label className="text-sm text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplateSettings = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Type
          </label>
          <select
            value={template?.type || 'structured'}
            onChange={(e) => onTemplateChange({
              ...template,
              type: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="structured">Structured Layout</option>
            <option value="colorBased">Color-Based Design</option>
          </select>
        </div>

        {template?.type === 'colorBased' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={template?.colorBasedSettings?.backgroundColor || '#ffffff'}
                onChange={(e) => onTemplateChange({
                  ...template,
                  colorBasedSettings: {
                    ...template?.colorBasedSettings,
                    backgroundColor: e.target.value
                  }
                })}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={template?.colorBasedSettings?.textColor || '#000000'}
                onChange={(e) => onTemplateChange({
                  ...template,
                  colorBasedSettings: {
                    ...template?.colorBasedSettings,
                    textColor: e.target.value
                  }
                })}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Banner Configuration</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'scenario', label: 'Scenario' },
          { id: 'visibility', label: 'Visibility' },
          { id: 'template', label: 'Template' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'scenario' && (
          <div>
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
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{scenario.icon}</span>
                      <h4 className="font-medium text-gray-900">{scenario.label}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                </div>
              ))}
            </div>

            {/* Scenario Configuration */}
            {selectedScenario !== 'custom' && (
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Scenario Configuration</h4>
                <p className="text-sm text-gray-600">
                  Advanced {selectedScenario} scenario settings will be available here.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'visibility' && (
          <div>{renderVisibilityControls()}</div>
        )}
        {activeTab === 'template' && (
          <div>{renderTemplateSettings()}</div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBannerScenarios;