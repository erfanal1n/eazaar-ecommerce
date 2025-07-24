import React from "react";
import { Order } from "@/types/order-amount-type";
import { InvoiceSettings } from "@/types/invoice-type";
import { useGetInvoiceSettingsQuery } from "@/redux/invoice-settings/invoiceSettingsApi";
import dayjs from "dayjs";

// prop type
type IPropType = {
  orderData: Order;
};

const InvoicePrint = ({ orderData }: IPropType) => {
  // Fetch invoice settings from database
  const { data: settingsData, isLoading, error } = useGetInvoiceSettingsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading invoice settings...</span>
      </div>
    );
  }

  if (error || !settingsData?.success) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        Error loading invoice settings
      </div>
    );
  }

  const settings = settingsData.data;

  // Calculate totals
  const total = orderData.cart.reduce((sum, item) => sum + (item.orderQuantity * item.price), 0);
  const tax = settings.showTax ? (total * (settings.taxRate || 0) / 100) : 0;
  const shippingCost = orderData.shippingCost || 0;
  const grand_total = total + tax + shippingCost;

  // Format date according to settings
  const formatDate = (dateString?: string) => {
    if (!dateString) return dayjs().format(settings.dateFormat || "MM/DD/YYYY");
    const date = dayjs(dateString);
    return date.format(settings.dateFormat || "MM/DD/YYYY");
  };

  // Helper functions for styling
  const getHeaderClass = () => {
    return 'text-white'; // modern style with gradient
  };

  const getTableRowClass = (index: number) => {
    return index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
  };
  return (
    <div 
      className="max-w-4xl mx-auto bg-white shadow-lg"
      style={{ 
        fontFamily: settings.fontFamily,
        borderRadius: settings.showBorder ? settings.borderRadius : '0'
      }}
    >
      {/* Header */}
      <div 
        className={`${getHeaderClass()} p-8`}
        style={{ 
          background: settings.headerStyle === 'modern' 
            ? `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`
            : undefined
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {settings.showLogo && settings.logo && (
              <img 
                src={settings.logo} 
                alt="Company Logo" 
                className="h-16 w-auto"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{settings.companyName}</h1>
              {settings.showCompanyInfo && (
                <div className="mt-2 text-sm opacity-90">
                  <p>{settings.companyAddress}</p>
                  <p>{settings.companyCity}</p>
                  <p>{settings.companyPhone}</p>
                  <p>{settings.companyEmail}</p>
                  {settings.companyWebsite && <p>{settings.companyWebsite}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-lg mt-2">#{settings.invoicePrefix}-{orderData.invoice}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: settings.primaryColor }}>
              Bill To:
            </h3>
            <div className="text-gray-700">
              <p className="font-medium">{orderData.name}</p>
              <p>{orderData.country}</p>
              <p>{orderData.city}</p>
              <p>{orderData.contact}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Invoice Date:</span>
                <span>{formatDate(orderData.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{orderData.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr 
                className="text-white text-sm font-semibold"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-center py-3 px-4">Qty</th>
                <th className="text-right py-3 px-4">Unit Price</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.cart.map((item, index) => (
                <tr key={item._id} className={getTableRowClass(index)}>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">{item.orderQuantity}</td>
                  <td className="py-4 px-4 text-right">
                    {settings.currencySymbol}{item.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right font-medium">
                    {settings.currencySymbol}{(item.orderQuantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>{settings.currencySymbol}{total.toFixed(2)}</span>
              </div>
              {settings.showTax && (
                <div className="flex justify-between py-2">
                  <span>Tax ({settings.taxRate}%):</span>
                  <span>{settings.currencySymbol}{tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span>Shipping:</span>
                <span>{settings.currencySymbol}{shippingCost.toFixed(2)}</span>
              </div>
              <div 
                className="flex justify-between py-3 text-lg font-bold border-t-2"
                style={{ borderColor: settings.accentColor }}
              >
                <span>Total:</span>
                <span style={{ color: settings.accentColor }}>
                  {settings.currencySymbol}{grand_total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        {settings.showThankYouMessage && (
          <div 
            className="text-center p-6 rounded-lg mb-6"
            style={{ backgroundColor: `${settings.accentColor}15`, color: settings.accentColor }}
          >
            <h3 className="text-xl font-semibold">{settings.thankYouMessage}</h3>
          </div>
        )}

        {/* Footer */}
        {settings.footerText && (
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>{settings.footerText}</p>
          </div>
        )}
      </div>
    </div>

  );
};

export default InvoicePrint;
