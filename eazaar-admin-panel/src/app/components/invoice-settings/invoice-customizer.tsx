"use client";
import React, { useState, useRef, useCallback } from "react";
import { InvoiceSettings } from "@/types/invoice-type";
import { 
  BuildingOfficeIcon, 
  PaintBrushIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  Cog6ToothIcon,
  PhotoIcon,
  BeakerIcon
} from "@heroicons/react/24/outline";

interface Props {
  settings: InvoiceSettings;
  onSettingsChange: (settings: InvoiceSettings) => void;
}

const InvoiceCustomizer = ({ settings, onSettingsChange }: Props) => {
  const [activeTab, setActiveTab] = useState('company');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = useCallback((field: keyof InvoiceSettings, value: any) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    onSettingsChange(newSettings);
  }, [settings, onSettingsChange]);

  const handleFileUpload = useCallback(async (file: File, type: 'logo' | 'signature') => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Simulate upload delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange(type, event.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      console.error('Upload failed:', error);
    }
  }, [handleChange]);

  const handleDrop = useCallback((e: React.DragEvent, type: 'logo' | 'signature') => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileUpload(files[0], type);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Predefined color palettes for quick selection
  const colorPalettes = [
    { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#1e293b', accent: '#06b6d4' },
    { name: 'Forest Green', primary: '#10b981', secondary: '#1f2937', accent: '#059669' },
    { name: 'Royal Purple', primary: '#8b5cf6', secondary: '#1e1b4b', accent: '#7c3aed' },
    { name: 'Sunset Orange', primary: '#f97316', secondary: '#1c1917', accent: '#ea580c' },
    { name: 'Rose Gold', primary: '#e11d48', secondary: '#1f2937', accent: '#be123c' },
    { name: 'Midnight', primary: '#6366f1', secondary: '#0f172a', accent: '#4f46e5' },
    { name: 'Emerald', primary: '#059669', secondary: '#064e3b', accent: '#047857' },
    { name: 'Crimson', primary: '#dc2626', secondary: '#1f2937', accent: '#b91c1c' }
  ];

  // Font options with preview
  const fontOptions = [
    { name: 'Inter', value: 'Inter', style: 'Modern & Clean' },
    { name: 'Roboto', value: 'Roboto', style: 'Professional' },
    { name: 'Open Sans', value: 'Open Sans', style: 'Friendly' },
    { name: 'Lato', value: 'Lato', style: 'Elegant' },
    { name: 'Montserrat', value: 'Montserrat', style: 'Bold & Modern' },
    { name: 'Poppins', value: 'Poppins', style: 'Trendy' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro', style: 'Technical' },
    { name: 'Nunito', value: 'Nunito', style: 'Rounded & Soft' }
  ];

  const tabs = [
    { 
      id: 'company', 
      label: 'Company Info', 
      icon: BuildingOfficeIcon
    },
    { 
      id: 'design', 
      label: 'Design', 
      icon: PaintBrushIcon
    },
    { 
      id: 'layout', 
      label: 'Layout', 
      icon: DocumentTextIcon
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      icon: BeakerIcon
    },
  ];

  return (
    <div className="bg-white rounded-md">
      {/* Clean Header */}
      <div className="px-8 py-6 border-b border-gray6">
        <h3 className="text-lg font-medium text-heading mb-1">Invoice Customizer</h3>
        <p className="text-sm text-text2">Customize your invoice template settings</p>
      </div>

      {/* Clean Tab Navigation */}
      <div className="px-8 py-4 border-b border-gray6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium 
                transition-colors duration-200
                ${isActive 
                  ? 'bg-theme text-white' 
                  : 'text-text2 hover:text-heading hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
        
        {/* Company Information Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            {/* Company Details */}
            <div>
              <h4 className="text-base font-medium text-heading mb-4">Company Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-heading">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName || ""}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="form-control"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-heading">Street Address</label>
                    <input
                      type="text"
                      value={settings.companyAddress || ""}
                      onChange={(e) => handleChange('companyAddress', e.target.value)}
                      className="form-control"
                      placeholder="123 Business Street"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-heading">City, State ZIP</label>
                    <input
                      type="text"
                      value={settings.companyCity || ""}
                      onChange={(e) => handleChange('companyCity', e.target.value)}
                      className="form-control"
                      placeholder="City, State 12345"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-heading">Phone Number</label>
                    <input
                      type="text"
                      value={settings.companyPhone || ""}
                      onChange={(e) => handleChange('companyPhone', e.target.value)}
                      className="form-control"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-heading">Email Address</label>
                    <input
                      type="email"
                      value={settings.companyEmail || ""}
                      onChange={(e) => handleChange('companyEmail', e.target.value)}
                      className="form-control"
                      placeholder="info@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-heading">Website</label>
                  <input
                    type="text"
                    value={settings.companyWebsite || ""}
                    onChange={(e) => handleChange('companyWebsite', e.target.value)}
                    className="form-control"
                    placeholder="www.company.com"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-base font-medium text-heading mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-heading">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.contactPhone || ""}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="form-control"
                    placeholder="+01234567890"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-heading">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail || ""}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="form-control"
                    placeholder="demo@mail.com"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-heading">Contact Address</label>
                <input
                  type="text"
                  value={settings.contactAddress || ""}
                  onChange={(e) => handleChange('contactAddress', e.target.value)}
                  className="form-control"
                  placeholder="Your Location Here"
                />
              </div>
            </div>
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-gradient-to-br from-purple-50/80 via-violet-50/60 to-fuchsia-50/80 rounded-2xl p-6 border border-purple-100/60 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25">
                  <PhotoIcon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-heading mb-0 tracking-tight">Logo & Branding</h4>
              </div>
              
              <div>
                <label className="block mb-3 text-xs font-bold text-text2 uppercase tracking-widest">Company Logo</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                      className="w-full h-12 px-4 text-sm bg-white border-2 border-gray-200 rounded-xl transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-purple-500 file:via-violet-600 file:to-fuchsia-600 file:text-white hover:file:from-purple-600 hover:file:via-violet-700 hover:file:to-fuchsia-700 file:cursor-pointer file:shadow-lg file:shadow-purple-500/25 hover:file:shadow-purple-500/40 file:transition-all file:duration-300"
                    />
                  </div>
                  {settings.logo && (
                    <div className="w-20 h-20 border-2 border-purple-200 rounded-2xl overflow-hidden bg-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-red-50/80 rounded-2xl p-6 border border-orange-100/60 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-600 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-500/25">
                  <PaintBrushIcon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-heading mb-0 tracking-tight">Color Scheme</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-3 text-xs font-bold text-text2 uppercase tracking-widest">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={settings.primaryColor || "#e91e63"}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-xl border-2 border-white pointer-events-none"></div>
                    </div>
                    <input
                      type="text"
                      value={settings.primaryColor || "#e91e63"}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="flex-1 h-12 px-4 text-sm font-mono uppercase bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder="#e91e63"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-3 text-xs font-bold text-text2 uppercase tracking-widest">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={settings.secondaryColor || "#333333"}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-xl border-2 border-white pointer-events-none"></div>
                    </div>
                    <input
                      type="text"
                      value={settings.secondaryColor || "#333333"}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="flex-1 h-12 px-4 text-sm font-mono uppercase bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder="#333333"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <DocumentTextIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-heading mb-0">Typography</h4>
              </div>
              
              <div>
                <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Font Family</label>
                <select
                  value={settings.fontFamily || "Inter"}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="form-control h-12 text-sm font-medium"
                >
                  <option value="Inter">Inter (Modern)</option>
                  <option value="Arial">Arial (Classic)</option>
                  <option value="Helvetica">Helvetica (Clean)</option>
                  <option value="Times New Roman">Times New Roman (Traditional)</option>
                  <option value="Georgia">Georgia (Elegant)</option>
                  <option value="Roboto">Roboto (Professional)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            {/* Currency & Numbering */}
            <div>
              <h4 className="text-base font-medium text-heading mb-4">Currency & Numbering</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-heading">Currency</label>
                  <select
                    value={settings.currency || "USD"}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="form-control"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="BDT">BDT - Bangladeshi Taka</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-heading">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currencySymbol || "$"}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                    className="form-control"
                    placeholder="$"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Invoice Prefix</label>
                  <input
                    type="text"
                    value={settings.invoicePrefix || "INV"}
                    onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                    className="form-control h-12 text-sm font-medium"
                    placeholder="INV"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Date Format</label>
                  <select
                    value={settings.dateFormat || "DD/MMMM/YYYY"}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    className="form-control h-12 text-sm font-medium"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                    <option value="DD/MMMM/YYYY">DD/MMMM/YYYY (Long)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-heading mb-0">Tax Configuration</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showTax"
                    checked={settings.showTax || false}
                    onChange={(e) => handleChange('showTax', e.target.checked)}
                    className="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  <label htmlFor="showTax" className="text-sm font-medium text-heading">
                    Enable Tax Calculation
                  </label>
                </div>
                
                {settings.showTax && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.taxRate || 0}
                        onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                        className="form-control h-12 text-sm font-medium"
                        placeholder="10"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Tax Label</label>
                      <input
                        type="text"
                        value={settings.taxLabel || "Vat tax"}
                        onChange={(e) => handleChange('taxLabel', e.target.value)}
                        className="form-control h-12 text-sm font-medium"
                        placeholder="Vat tax"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-heading mb-0">Pricing & Fees</h4>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        id="showShipping"
                        checked={settings.showShipping || false}
                        onChange={(e) => handleChange('showShipping', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="showShipping" className="text-sm font-medium text-heading">
                        Show Shipping Cost
                      </label>
                    </div>
                    {settings.showShipping && (
                      <input
                        type="number"
                        value={settings.shippingCost || 0}
                        onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value) || 0)}
                        className="form-control h-12 text-sm font-medium"
                        placeholder="60"
                        min="0"
                        step="0.01"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        id="showDiscount"
                        checked={settings.showDiscount || false}
                        onChange={(e) => handleChange('showDiscount', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="showDiscount" className="text-sm font-medium text-heading">
                        Show Discount
                      </label>
                    </div>
                    {settings.showDiscount && (
                      <input
                        type="number"
                        value={settings.discountAmount || 0}
                        onChange={(e) => handleChange('discountAmount', parseFloat(e.target.value) || 0)}
                        className="form-control h-12 text-sm font-medium"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Payment Terms */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 border border-orange-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <DocumentTextIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-heading mb-0">Payment Terms</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Payment Terms (Days)</label>
                  <select
                    value={settings.paymentTerms || "30"}
                    onChange={(e) => handleChange('paymentTerms', e.target.value)}
                    className="form-control h-12 text-sm font-medium"
                  >
                    <option value="0">Due on Receipt</option>
                    <option value="7">Net 7 Days</option>
                    <option value="15">Net 15 Days</option>
                    <option value="30">Net 30 Days</option>
                    <option value="45">Net 45 Days</option>
                    <option value="60">Net 60 Days</option>
                    <option value="90">Net 90 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Late Fee (%)</label>
                  <input
                    type="number"
                    value={settings.lateFee || 0}
                    onChange={(e) => handleChange('lateFee', parseFloat(e.target.value) || 0)}
                    className="form-control h-12 text-sm font-medium"
                    placeholder="0"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Cog6ToothIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-heading mb-0">Display Options</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showLogo"
                      checked={settings.showLogo || false}
                      onChange={(e) => handleChange('showLogo', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="showLogo" className="text-sm font-medium text-heading">
                      Show Company Logo
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showCompanyInfo"
                      checked={settings.showCompanyInfo || false}
                      onChange={(e) => handleChange('showCompanyInfo', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="showCompanyInfo" className="text-sm font-medium text-heading">
                      Show Company Information
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showThankYouMessage"
                      checked={settings.showThankYouMessage || false}
                      onChange={(e) => handleChange('showThankYouMessage', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="showThankYouMessage" className="text-sm font-medium text-heading">
                      Show Thank You Message
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showSignature"
                      checked={settings.showSignature || false}
                      onChange={(e) => handleChange('showSignature', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="showSignature" className="text-sm font-medium text-heading">
                      Show Signature
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showBorder"
                      checked={settings.showBorder || false}
                      onChange={(e) => handleChange('showBorder', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="showBorder" className="text-sm font-medium text-heading">
                      Show Border & Shadow
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages & Text */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 border border-rose-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <DocumentTextIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-semibold text-heading mb-0">Custom Messages</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Thank You Message</label>
                  <input
                    type="text"
                    value={settings.thankYouMessage || ""}
                    onChange={(e) => handleChange('thankYouMessage', e.target.value)}
                    className="form-control h-12 text-sm"
                    placeholder="Thank you for your business!"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Footer Text</label>
                  <input
                    type="text"
                    value={settings.footerText || ""}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    className="form-control h-12 text-sm"
                    placeholder="This is a computer generated invoice."
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Terms & Conditions</label>
                  <textarea
                    value={settings.termsAndConditions || ""}
                    onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                    className="form-control text-sm resize-none"
                    rows={4}
                    placeholder="Payment is due within 30 days of invoice date..."
                  />
                </div>
              </div>
            </div>

            {/* Signature Upload */}
            {settings.showSignature && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-slate-600 rounded-lg flex items-center justify-center mr-3">
                    <PhotoIcon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-base font-semibold text-heading mb-0">Digital Signature</h4>
                </div>
                
                <div>
                  <label className="block mb-2 text-xs font-semibold text-text2 uppercase tracking-wider">Signature Image</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'signature')}
                        className="form-control h-12 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-gray-500 file:to-slate-600 file:text-white hover:file:from-gray-600 hover:file:to-slate-700 file:cursor-pointer"
                      />
                    </div>
                    {settings.signature && (
                      <div className="w-16 h-16 border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <img src={settings.signature} alt="Signature" className="w-full h-full object-contain p-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default InvoiceCustomizer;