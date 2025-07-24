"use client";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import UnifiedInvoice from "../common/unified-invoice";
import InvoiceCustomizerNew from "./invoice-customizer-new";
import { InvoiceSettings } from "@/types/invoice-type";
import { 
  useGetInvoiceSettingsQuery, 
  useUpdateInvoiceSettingsMutation, 
  useResetInvoiceSettingsMutation 
} from "@/redux/invoice-settings/invoiceSettingsApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const InvoiceSettingsArea = () => {
  const printRef = useRef<HTMLDivElement | null>(null);
  
  // API hooks
  const { data: settingsData, isLoading, error } = useGetInvoiceSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateInvoiceSettingsMutation();
  const [resetSettings, { isLoading: isResetting }] = useResetInvoiceSettingsMutation();
  
  // Default invoice settings
  const defaultSettings: InvoiceSettings = {
    companyName: "Your Company Name",
    companyAddress: "123 Business Street",
    companyCity: "City, State 12345",
    companyPhone: "+1 (555) 123-4567",
    companyEmail: "info@yourcompany.com",
    companyWebsite: "www.yourcompany.com",
    logo: "",
    contactPhone: "+01234567890",
    contactEmail: "demo@mail.com",
    contactAddress: "Your Location Here",
    signature: "",
    showSignature: true,
    primaryColor: "#0989FF",
    secondaryColor: "#55585B", 
    accentColor: "#0989FF",
    fontFamily: "Poppins",
    showLogo: true,
    showCompanyInfo: true,
    showThankYouMessage: true,
    thankYouMessage: "Thank you for your business!",
    footerText: "This is a computer generated invoice.",
    termsAndConditions: "Payment is due within 30 days of invoice date. Late payments may incur additional charges. All services are subject to our standard terms and conditions. For questions regarding this invoice, please contact our billing department.",
    invoicePrefix: "INV",
    taxRate: 10,
    taxLabel: "Vat tax",
    showTax: true,
    currency: "USD",
    currencySymbol: "$",
    dateFormat: "DD/MMMM/YYYY",
    shippingCost: 60,
    discountAmount: 0,
    showShipping: true,
    showDiscount: true,
    paymentTerms: "30",
    lateFee: 0,
    showBorder: true,
    borderRadius: "8px"
  };
  
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(defaultSettings);

  // Update local state when data is fetched
  useEffect(() => {
    if (settingsData?.success && settingsData.data) {
      setInvoiceSettings(settingsData.data);
    }
  }, [settingsData]);

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: "Invoice Preview",
  });

  const handleSaveSettings = async () => {
    try {
      const result = await updateSettings(invoiceSettings).unwrap();
      if (result.success) {
        notifySuccess('Invoice settings saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      notifyError(error?.data?.message || 'Error saving settings. Please try again.');
    }
  };

  const handleResetSettings = async () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      try {
        const result = await resetSettings().unwrap();
        if (result.success) {
          setInvoiceSettings(result.data);
          notifySuccess('Settings reset to default successfully!');
        }
      } catch (error: any) {
        console.error('Error resetting settings:', error);
        notifyError(error?.data?.message || 'Error resetting settings. Please try again.');
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white px-8 py-8 rounded-md">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme mx-auto mb-4"></div>
            <p className="text-text2">Loading invoice settings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white px-8 py-8 rounded-md">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading invoice settings</p>
            <button 
              onClick={() => window.location.reload()} 
              className="tp-btn px-7 py-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4 xl:gap-6">
      {/* Customizer Panel */}
      <div className="xl:col-span-4 order-1">
        <InvoiceCustomizerNew 
          settings={invoiceSettings}
          onSettingsChange={setInvoiceSettings}
          onSave={handleSaveSettings}
        />
      </div>

      {/* Preview Panel */}
      <div className="xl:col-span-8 order-2">
        <div className="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h2 style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
              fontWeight: '700',
              color: '#010F1C',
              marginBottom: '0'
            }}>Live Preview</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-text2">Configure your invoice settings</span>
            </div>
          </div>
          
          <div className="border border-gray6 rounded-md p-2 sm:p-4 bg-gray-50 overflow-hidden">
            <div ref={printRef} className="w-full overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0">
                <UnifiedInvoice mode="preview" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSettingsArea;