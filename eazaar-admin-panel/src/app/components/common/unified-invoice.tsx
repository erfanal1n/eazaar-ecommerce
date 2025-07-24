"use client";
import React from "react";
import { Order } from "@/types/order-amount-type";
import { InvoiceSettings } from "@/types/invoice-type";
import { useGetInvoiceSettingsQuery } from "@/redux/invoice-settings/invoiceSettingsApi";
import dayjs from "dayjs";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface Props {
  mode: 'preview' | 'order';
  orderData?: Order;
  className?: string;
}

const UnifiedInvoice = ({ mode, orderData, className = "" }: Props) => {
  // Always fetch invoice settings from API for real-time updates
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

  // Use sample data for preview mode, real order data for order mode
  const invoiceData = mode === 'preview' ? getSampleData() : getOrderInvoiceData(orderData!, settings);

  const formatDate = (dateString?: string) => {
    if (!dateString) return dayjs().format('DD/MMMM/YYYY');
    const date = dayjs(dateString);
    switch (settings.dateFormat) {
      case 'DD/MM/YYYY':
        return date.format('DD/MM/YYYY');
      case 'MM/DD/YYYY':
        return date.format('MM/DD/YYYY');
      case 'YYYY-MM-DD':
        return date.format('YYYY-MM-DD');
      case 'DD/MMMM/YYYY':
        return date.format('DD/MMMM/YYYY');
      default:
        return date.format('DD/MMMM/YYYY');
    }
  };

  const formatCurrency = (amount: number) => {
    return `${settings.currencySymbol} ${amount.toFixed(2)}`;
  };

  // Invoice should always use light theme colors for professional document appearance
  const invoiceColors = {
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    text: '#000000',           // Changed to black for better visibility
    secondaryText: '#444444',  // Changed to darker gray for better visibility
    border: '#ddd',
    shadow: '0 0 10px rgba(0,0,0,0.1)'
  };

  // Inline styles object for the exact HTML design
  const styles = {
    invoiceContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: invoiceColors.cardBackground,
      boxShadow: invoiceColors.shadow,
      fontFamily: settings.fontFamily || 'var(--font-family-primary, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
      color: invoiceColors.text,
      width: '100%',
      minWidth: '320px'
    },
    header: {
      backgroundColor: settings.primaryColor,
      height: '10px'
    },
    brandSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'clamp(15px, 4vw, 30px) clamp(20px, 5vw, 40px)',
      flexWrap: 'wrap' as const,
      gap: '15px'
    },
    brandLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      border: `2px solid ${settings.primaryColor}`,
      transform: 'rotate(45deg)',
      position: 'relative' as const
    },
    brandName: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: invoiceColors.text,
      letterSpacing: '2px'
    },
    invoiceTitle: {
      fontSize: 'clamp(24px, 6vw, 48px)',
      fontWeight: 'bold',
      color: settings.primaryColor || '#0989FF'
    },
    invoiceDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 clamp(20px, 5vw, 40px) clamp(15px, 4vw, 30px)',
      flexWrap: 'wrap' as const,
      gap: '20px'
    },
    billTo: {
      flex: 1
    },
    billToH3: {
      fontSize: '14px',
      marginBottom: '5px'
    },
    companyName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: invoiceColors.text
    },
    address: {
      fontSize: '13px',
      color: invoiceColors.text,
      lineHeight: 1.5,
      fontWeight: '400'
    },
    invoiceMeta: {
      textAlign: 'right' as const
    },
    invoiceMetaP: {
      fontSize: '14px',
      marginBottom: '5px',
      color: invoiceColors.text,
      fontWeight: '500'
    },
    label: {
      fontWeight: 'bold',
      color: invoiceColors.text
    },
    itemsTable: {
      margin: '0 clamp(20px, 5vw, 40px) 0px',
      borderCollapse: 'collapse' as const,
      width: 'calc(100% - clamp(40px, 10vw, 80px))',
      fontSize: 'clamp(10px, 2vw, 12px)'
    },
    tableHead: {
      backgroundColor: settings.primaryColor,
      color: 'white'
    },
    tableTh: {
      padding: '12px',
      textAlign: 'left' as const,
      fontSize: '14px',
      fontWeight: 'normal'
    },
    tableThCenter: {
      padding: '12px',
      textAlign: 'center' as const,
      fontSize: '14px',
      fontWeight: 'normal'
    },
    tableTd: {
      padding: '12px',
      border: `1px solid ${invoiceColors.border}`,
      fontSize: '12px',
      color: invoiceColors.text
    },
    tableTdCenter: {
      padding: '12px',
      border: `1px solid ${invoiceColors.border}`,
      fontSize: '12px',
      textAlign: 'center' as const,
      color: invoiceColors.text
    },
    grandTotalSection: {
      margin: '0 clamp(20px, 5vw, 40px)'
    },
    grandTotalTable: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    grandTotalLabel: {
      backgroundColor: settings.primaryColor,
      color: 'white',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center' as const,
      border: `1px solid ${settings.primaryColor}`
    },
    grandTotalAmount: {
      backgroundColor: '#333',
      color: 'white',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '18px',
      textAlign: 'center' as const,
      width: '20%',
      border: '1px solid #333'
    },
    paymentInfo: {
      margin: '30px 40px 30px'
    },
    thankYou: {
      margin: '30px 40px',
      paddingTop: '30px',
      borderTop: `1px solid ${invoiceColors.border}`
    },
    thankYouH3: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: invoiceColors.text
    },
    thankYouP: {
      fontSize: '13px',
      color: invoiceColors.text,
      lineHeight: 1.6,
      marginBottom: '10px',
      fontWeight: '400'
    },
    signature: {
      textAlign: 'right' as const,
      marginTop: '20px'
    },
    signatureP: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: invoiceColors.text,
      fontWeight: '400'
    },
    footer: {
      backgroundColor: '#f8f9fa',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${invoiceColors.border}`,
      flexWrap: 'wrap' as const,
      gap: '15px'
    },
    footerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '400',
      flex: '1',
      minWidth: '150px'
    },
    footerIcon: {
      width: '24px',
      height: '24px',
      backgroundColor: settings.primaryColor,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexShrink: 0
    },
    footerIconPink: {
      width: '24px',
      height: '24px',
      backgroundColor: settings.primaryColor,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexShrink: 0
    },
    bottomBar: {
      backgroundColor: settings.secondaryColor,
      height: '40px'
    }
  };

  return (
    <div className={className} style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={styles.invoiceContainer} className="invoice-table-light-mode">
        {/* Header */}
        <div style={styles.header}></div>
        
        {/* Brand Section */}
        <div style={styles.brandSection}>
          <div style={styles.brandLogo}>
            {settings.showLogo && settings.logo ? (
              <img 
                src={settings.logo} 
                alt="Company Logo" 
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'contain',
                  marginRight: '10px'
                }}
              />
            ) : (
              <div style={styles.logoIcon}></div>
            )}
            <span style={styles.brandName}>{settings.companyName || 'BRAND'}</span>
          </div>
          <div className="invoice-title" style={{
            fontSize: 'clamp(24px, 6vw, 48px)',
            fontWeight: 'bold'
          }}>INVOICE</div>
        </div>
        
        {/* Invoice Details */}
        <div style={styles.invoiceDetails}>
          <div style={styles.billTo} className="bill-to">
            <h3 style={styles.billToH3}>Bill To</h3>
            <div style={styles.companyName} className="company-name">{invoiceData.customerName}</div>
            <div style={styles.address} className="address">
              {invoiceData.customerAddress}<br/>
              {invoiceData.customerEmail}<br/>
              {invoiceData.customerPhone}
            </div>
          </div>
          <div style={styles.invoiceMeta} className="invoice-meta">
            <p style={styles.invoiceMetaP}>
              <span style={styles.label}>Invoice No:</span> {settings.invoicePrefix}-{invoiceData.invoice}
            </p>
            <p style={styles.invoiceMetaP}>
              <span style={styles.label}>Date:</span> {formatDate(invoiceData.date)}
            </p>
            <p style={{...styles.invoiceMetaP, marginTop: '20px', fontWeight: 'bold'}}>
              <span style={{fontWeight: 'bold'}}>PAYMENT METHOD:</span> {mode === 'order' && orderData?.paymentMethod ? orderData.paymentMethod : 'COD'}
            </p>
          </div>
        </div>
        
        {/* Items Table */}
        <table style={styles.itemsTable} className="invoice-table">
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.tableTh}>NO</th>
              <th style={styles.tableTh}>ITEM DESCRIPTION</th>
              <th style={styles.tableThCenter}>PRICE</th>
              <th style={styles.tableThCenter}>QTY</th>
              <th style={styles.tableThCenter}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={item._id} className="invoice-table-row">
                <td style={styles.tableTd} className="invoice-table-cell">{String(index + 1).padStart(2, '0')}</td>
                <td style={styles.tableTd} className="invoice-table-cell">{item.title}</td>
                <td style={styles.tableTdCenter} className="invoice-table-cell">{formatCurrency(item.price)}</td>
                <td style={styles.tableTdCenter} className="invoice-table-cell">{String(item.quantity).padStart(2, '0')}</td>
                <td style={styles.tableTdCenter} className="invoice-table-cell">{formatCurrency(item.total)}</td>
              </tr>
            ))}
            
            {/* Subtotal Row */}
            <tr className="invoice-table-row">
              <td style={styles.tableTd} className="invoice-table-cell" colSpan={2}></td>
              <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px', fontWeight: 'bold'}} className="invoice-table-cell" colSpan={2}>Sub Total</td>
              <td style={styles.tableTdCenter} className="invoice-table-cell">{formatCurrency(invoiceData.subtotal)}</td>
            </tr>
            
            {/* Shipping Cost Row */}
            {invoiceData.shippingCost > 0 && (
              <tr className="invoice-table-row">
                <td style={styles.tableTd} className="invoice-table-cell" colSpan={2}></td>
                <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px'}} className="invoice-table-cell" colSpan={2}>Shipping Cost</td>
                <td style={styles.tableTdCenter} className="invoice-table-cell">{formatCurrency(invoiceData.shippingCost)}</td>
              </tr>
            )}
            
            {/* Discount Row */}
            <tr className="invoice-table-row">
              <td style={styles.tableTd} className="invoice-table-cell" colSpan={2}></td>
              <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px'}} className="invoice-table-cell" colSpan={2}>Discount</td>
              <td style={styles.tableTdCenter} className="invoice-table-cell">{formatCurrency(invoiceData.discount)}</td>
            </tr>
            
            {/* Tax Row */}
            {settings.showTax && invoiceData.tax > 0 && (
              <tr className="invoice-table-row">
                <td style={styles.tableTd} className="invoice-table-cell" colSpan={2}></td>
                <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px'}} className="invoice-table-cell" colSpan={2}>Vat tax {settings.taxRate}%</td>
                <td style={styles.tableTdCenter} className="invoice-table-cell">{formatCurrency(invoiceData.tax)}</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Grand Total */}
        <div style={styles.grandTotalSection}>
          <table style={styles.grandTotalTable} className="grand-total-table">
            <tr className="grand-total-row">
              <td style={styles.grandTotalLabel} className="grand-total-label">GRAND TOTAL</td>
              <td style={styles.grandTotalAmount} className="grand-total-amount">{formatCurrency(invoiceData.total)}</td>
            </tr>
          </table>
        </div>
        
        {/* Payment Info */}
        <div style={styles.paymentInfo} className="payment-info">
          <h3 style={{fontSize: '14px', fontStyle: 'italic', fontWeight: 'normal', color: '#444444', textAlign: 'center', margin: '20px 0'}}>
            {settings.footerText || 'This is a Computer Generated Invoice'}
          </h3>
        </div>
        
        {/* Thank You Section */}
        {settings.showThankYouMessage && (
          <div style={styles.thankYou} className="thank-you">
            <h3 style={styles.thankYouH3}>
              {settings.thankYouMessage || 'Thank you for your Business!'}
            </h3>
            <p style={styles.thankYouP}>
              <span style={{fontWeight: 'bold'}}>Terms:</span> {settings.termsAndConditions || 'Payment is due within 30 days of invoice date. Late payments may incur additional charges. All services are subject to our standard terms and conditions. For questions regarding this invoice, please contact our billing department.'}
            </p>
            <div style={styles.signature}>
              {settings.showSignature && settings.signature ? (
                <div style={{marginBottom: '10px'}}>
                  <img 
                    src={settings.signature} 
                    alt="Signature" 
                    style={{
                      maxWidth: '150px',
                      maxHeight: '60px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : null}
              <p style={styles.signatureP}>
                Signature Here
              </p>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerItem} className="footer-item">
            <div style={styles.footerIcon} className="footer-icon">
              <PhoneIcon style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <div style={{ lineHeight: '1.3' }}>
              <div style={{ fontSize: '12px !important', marginBottom: '2px', color: '#6b7280 !important', fontWeight: '400 !important' }}>{settings.companyPhone || '0000 00000 00000'}</div>
              <div style={{ fontSize: '12px !important', color: '#6b7280 !important', fontWeight: '400 !important' }}>{settings.contactPhone || '0000 00000 00000'}</div>
            </div>
          </div>
          <div style={styles.footerItem} className="footer-item">
            <div style={styles.footerIconPink} className="footer-icon-pink">
              <EnvelopeIcon style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <div style={{ lineHeight: '1.3' }}>
              <div style={{ fontSize: '12px !important', marginBottom: '2px', color: '#6b7280 !important', fontWeight: '400 !important' }}>{settings.companyEmail || 'yourmail@domainhere'}</div>
              <div style={{ fontSize: '12px !important', color: '#6b7280 !important', fontWeight: '400 !important' }}>{settings.contactEmail || 'yourmail@domainhere'}</div>
            </div>
          </div>
          <div style={styles.footerItem} className="footer-item">
            <div style={styles.footerIcon} className="footer-icon">
              <MapPinIcon style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <div style={{ lineHeight: '1.3' }}>
              <div style={{ fontSize: '12px !important', marginBottom: '2px', color: '#6b7280 !important', fontWeight: '400 !important' }}>{settings.companyAddress || 'Street Address Here'}</div>
              <div style={{ fontSize: '12px !important', color: '#6b7280 !important', fontWeight: '400 !important' }}>{settings.companyCity || 'Country-00000'}</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={styles.bottomBar}></div>
      </div>
      
      <style jsx>{`
        .invoice-table-light-mode {
          overflow-x: auto;
        }
        
        .invoice-table-light-mode .invoice-table,
        .invoice-table-light-mode .invoice-table *,
        .invoice-table-light-mode .invoice-table-row,
        .invoice-table-light-mode .invoice-table-cell {
          background-color: white !important;
          color: black !important;
          border-color: #ddd !important;
        }
        
        @media (max-width: 768px) {
          .invoice-table-light-mode .invoice-table {
            font-size: 10px !important;
          }
          
          .invoice-table-light-mode .invoice-table th,
          .invoice-table-light-mode .invoice-table td {
            padding: 8px 4px !important;
            font-size: 10px !important;
          }
          
          .invoice-table-light-mode .grand-total-table td {
            font-size: 12px !important;
            padding: 8px !important;
          }
        }
        
        @media (max-width: 480px) {
          .invoice-table-light-mode .invoice-table {
            font-size: 9px !important;
          }
          
          .invoice-table-light-mode .invoice-table th,
          .invoice-table-light-mode .invoice-table td {
            padding: 6px 2px !important;
            font-size: 9px !important;
          }
          
          .invoice-table-light-mode .grand-total-table td {
            font-size: 10px !important;
            padding: 6px !important;
          }
        }
        
        .invoice-table-light-mode .invoice-table thead tr {
          background-color: ${settings.primaryColor} !important;
          color: white !important;
        }
        
        .invoice-table-light-mode .invoice-table thead th {
          background-color: ${settings.primaryColor} !important;
          color: white !important;
        }
        
        .invoice-table-light-mode .grand-total-table,
        .invoice-table-light-mode .grand-total-row {
          background-color: transparent !important;
        }
        
        .invoice-table-light-mode .grand-total-label {
          background-color: ${settings.primaryColor} !important;
          color: white !important;
          border: 1px solid ${settings.primaryColor} !important;
        }
        
        .invoice-table-light-mode .grand-total-amount {
          background-color: #333 !important;
          color: white !important;
          border: 1px solid #333 !important;
        }
        
        .invoice-table-light-mode .footer-text,
        .invoice-table-light-mode .thank-you-message,
        .invoice-table-light-mode p,
        .invoice-table-light-mode div[style*="color"] {
          color: black !important;
        }
        
        .invoice-table-light-mode .invoice-title {
          color: ${settings.primaryColor || '#0989FF'} !important;
        }
        
        .invoice-table-light-mode .bill-to h3,
        .invoice-table-light-mode .company-name,
        .invoice-table-light-mode .address,
        .invoice-table-light-mode .invoice-meta p,
        .invoice-table-light-mode .thank-you h3,
        .invoice-table-light-mode .thank-you p,
        .invoice-table-light-mode .footer-item,
        .invoice-table-light-mode .footer-item div,
        .invoice-table-light-mode .payment-info h3 {
          color: black !important;
        }
        
        .invoice-table-light-mode .footer-item svg,
        .invoice-table-light-mode .footer-icon svg,
        .invoice-table-light-mode .footer-icon-pink svg {
          color: white !important;
          fill: white !important;
        }
        
        .dark .invoice-table-light-mode .footer-text,
        .dark .invoice-table-light-mode .thank-you-message,
        .dark .invoice-table-light-mode p,
        .dark .invoice-table-light-mode div,
        .dark .invoice-table-light-mode span,
        .dark .invoice-table-light-mode * {
          color: black !important;
        }
      `}</style>
    </div>
  );
};

// Sample data for preview mode
function getSampleData() {
  return {
    invoice: "000000",
    date: new Date().toISOString(),
    customerName: "CREATIVE AGENCY",
    customerPhone: "0000 0000 0000",
    customerEmail: "Yourname@emailhere",
    customerAddress: "1234 Street Address here, City Zip Code -1234",
    items: [
      {
        _id: "01",
        title: "Website Development Service",
        quantity: 1,
        price: 500,
        total: 500
      },
      {
        _id: "02", 
        title: "Logo Design Package",
        quantity: 1,
        price: 300,
        total: 300
      },
      {
        _id: "03",
        title: "Social Media Marketing", 
        quantity: 2,
        price: 250,
        total: 500
      },
      {
        _id: "04",
        title: "SEO Optimization Service",
        quantity: 1,
        price: 400,
        total: 400
      },
      {
        _id: "05",
        title: "Content Writing (10 Articles)",
        quantity: 10,
        price: 150,
        total: 1500
      },
      {
        _id: "06",
        title: "Email Marketing Campaign",
        quantity: 3,
        price: 200,
        total: 600
      },
      {
        _id: "07",
        title: "Mobile App UI Design",
        quantity: 1,
        price: 800,
        total: 800
      }
    ],
    subtotal: 4600,
    tax: 466,
    shippingCost: 60,
    discount: 0,
    total: 5126
  };
}

// Convert order data to invoice format
function getOrderInvoiceData(orderData: Order, settings: InvoiceSettings) {
  // Safety checks for required data
  if (!orderData) {
    return getSampleData();
  }

  const cart = orderData.cart || [];
  const subtotal = cart.reduce((sum, item) => sum + ((item.orderQuantity || 0) * (item.price || 0)), 0);
  const tax = settings.showTax ? (subtotal * (settings.taxRate || 0) / 100) : 0;
  const shippingCost = orderData.shippingCost || 0;
  const discount = orderData.discount || 0;
  const total = subtotal + tax + shippingCost - discount;

  return {
    invoice: orderData.invoice ? orderData.invoice.toString() : "000000",
    date: orderData.createdAt || new Date().toISOString(),
    customerName: orderData.user?.name || "Customer",
    customerPhone: (orderData.user as any)?.phone || (orderData.user as any)?.contactNumber || "N/A",
    customerEmail: orderData.user?.email || "N/A",
    customerAddress: orderData.address || (orderData.user as any)?.address || "N/A",
    items: cart.map((item, index) => ({
      _id: (index + 1).toString(),
      title: item.title || "Product",
      quantity: item.orderQuantity || 1,
      price: item.price || 0,
      total: (item.orderQuantity || 1) * (item.price || 0)
    })),
    subtotal,
    tax,
    shippingCost,
    discount,
    total
  };
}

export default UnifiedInvoice;