'use client';
import React from "react";
import { useGetInvoiceSettingsQuery } from "@/redux/features/invoice/invoiceSettingsApi";
// import { useTheme } from "@/context/ThemeContext"; // Removed - invoice should always use light theme
import { 
  transformOrderToInvoiceData, 
  getDefaultInvoiceSettings, 
  formatCurrency, 
  formatDate 
} from "@/utils/invoice-utils";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

const UnifiedInvoice = ({ orderData, className = "", mode = "order" }) => {
  // Fetch invoice settings from API
  const { data: settingsData, isLoading, error } = useGetInvoiceSettingsQuery();
  
  // Note: Invoice should always use light theme for consistency as a document
  // const { theme, isDark } = useTheme(); // Removed theme dependency for invoice
  
  // Fallback: Direct API call if Redux fails
  const [fallbackSettings, setFallbackSettings] = React.useState(null);
  
  React.useEffect(() => {
    if (error && !fallbackSettings) {
      console.log('🔄 Attempting fallback API call...');
      fetch('http://localhost:7000/api/invoice-settings')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Fallback API call successful');
            setFallbackSettings(data.data);
          }
        })
        .catch(err => {
          console.error('❌ Fallback API call also failed:', err);
        });
    }
  }, [error, fallbackSettings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <span className="ml-2">Loading invoice settings...</span>
      </div>
    );
  }

  // Debug logging (can be removed in production)
  console.log('🔍 Invoice Settings Debug Info:', {
    isLoading,
    hasData: !!settingsData,
    hasError: !!error,
    settingsData,
    error,
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  });

  // Use API data if available, otherwise use backend defaults
  let settings = getDefaultInvoiceSettings();
  
  if (settingsData?.success && settingsData?.data) {
    settings = settingsData.data;
    console.log('✅ Using custom invoice settings from Redux API:', settings.companyName);
  } else if (fallbackSettings) {
    settings = fallbackSettings;
    console.log('✅ Using custom invoice settings from fallback API:', settings.companyName);
  } else if (error) {
    console.error('❌ Failed to load invoice settings, using defaults:', error);
    // Show user-friendly error in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('🛠️ Troubleshooting tips:');
      console.warn('1. Check if backend server is running on port 7000');
      console.warn('2. Verify CORS is configured for localhost:3000');
      console.warn('3. Check network tab for actual HTTP request/response');
    }
  } else if (!settingsData && !error && !isLoading) {
    console.warn('⚠️ No settings data and no error - this shouldn\'t happen');
  }

  // Transform order data to invoice format
  const invoiceData = transformOrderToInvoiceData(orderData, settings);

  // Invoice should always use light theme colors for professional document appearance
  const invoiceColors = {
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    text: '#000000',           // Changed to black for better visibility
    secondaryText: '#444444',  // Changed to darker gray for better visibility
    border: '#ddd',
    shadow: '0 0 10px rgba(0,0,0,0.1)'
  };

  // Inline styles for professional invoice design
  const styles = {
    invoiceContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: invoiceColors.cardBackground,
      boxShadow: settings.showBorder ? invoiceColors.shadow : 'none',
      fontFamily: settings.fontFamily || 'var(--font-family-primary, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
      borderRadius: settings.showBorder ? (settings.borderRadius || '0px') : '0px',
      color: invoiceColors.text
    },
    header: {
      backgroundColor: settings.primaryColor,
      height: '10px'
    },
    brandSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '30px 40px'
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
      position: 'relative'
    },
    brandName: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: invoiceColors.text,
      letterSpacing: '2px'
    },
    invoiceTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: settings.primaryColor
    },
    invoiceDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 40px 30px'
    },
    billTo: {
      flex: 1
    },
    billToH3: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: invoiceColors.text
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
      textAlign: 'right'
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
      margin: '0 40px 0px',
      borderCollapse: 'collapse',
      width: 'calc(100% - 80px)'
    },
    tableHead: {
      backgroundColor: settings.primaryColor,
      color: 'white'
    },
    tableTh: {
      padding: '12px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'normal'
    },
    tableThCenter: {
      padding: '12px',
      textAlign: 'center',
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
      textAlign: 'center',
      color: invoiceColors.text
    },
    grandTotalSection: {
      margin: '0 40px'
    },
    grandTotalTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    grandTotalLabel: {
      backgroundColor: settings.primaryColor,
      color: 'white',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center',
      border: `1px solid ${settings.primaryColor}`
    },
    grandTotalAmount: {
      backgroundColor: settings.secondaryColor || '#333',
      color: 'white',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '18px',
      textAlign: 'center',
      width: '20%',
      border: `1px solid ${settings.secondaryColor || '#333'}`
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
      textAlign: 'right',
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
      padding: '30px 40px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: `1px solid ${invoiceColors.border}`
    },
    footerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13px',
      color: invoiceColors.text,
      fontWeight: '500'
    },
    footerIcon: {
      width: '30px',
      height: '30px',
      backgroundColor: settings.primaryColor,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    footerIconPink: {
      width: '30px',
      height: '30px',
      backgroundColor: settings.primaryColor,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    bottomBar: {
      backgroundColor: settings.secondaryColor,
      height: '40px'
    }
  };

  return (
    <div className={className} style={{ backgroundColor: invoiceColors.background, padding: '20px' }}>
      <div style={styles.invoiceContainer}>
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
            ) : settings.showLogo ? (
              <div style={styles.logoIcon}></div>
            ) : null}
            {settings.showCompanyInfo && (
              <span style={styles.brandName}>
                {settings.companyName || 'SHOFY'}
              </span>
            )}
          </div>
          <div style={styles.invoiceTitle}>INVOICE</div>
        </div>
        
        {/* Invoice Details */}
        <div style={styles.invoiceDetails}>
          <div style={styles.billTo}>
            <h3 style={styles.billToH3}>Bill To</h3>
            <div style={styles.companyName}>{invoiceData.customerName}</div>
            <div style={styles.address}>
              {invoiceData.customerAddress && invoiceData.customerAddress !== ', ' ? (
                <>
                  {invoiceData.customerAddress}<br/>
                  {invoiceData.customerPhone && invoiceData.customerPhone !== 'N/A' && (
                    <>{invoiceData.customerPhone}<br/></>
                  )}
                  {invoiceData.customerEmail && invoiceData.customerEmail !== 'N/A' && (
                    <>{invoiceData.customerEmail}</>
                  )}
                </>
              ) : (
                <>
                  {invoiceData.customerPhone && invoiceData.customerPhone !== 'N/A' && (
                    <>{invoiceData.customerPhone}<br/></>
                  )}
                  {invoiceData.customerEmail && invoiceData.customerEmail !== 'N/A' && (
                    <>{invoiceData.customerEmail}</>
                  )}
                </>
              )}
            </div>
          </div>
          <div style={styles.invoiceMeta}>
            <p style={styles.invoiceMetaP}>
              <span style={styles.label}>Invoice No:</span> {settings.invoicePrefix}-{invoiceData.invoice}
            </p>
            <p style={styles.invoiceMetaP}>
              <span style={styles.label}>Date:</span> {formatDate(invoiceData.date, settings.dateFormat)}
            </p>
            <p style={{...styles.invoiceMetaP, marginTop: '20px', fontWeight: 'bold'}}>
              <span style={{fontWeight: 'bold'}}>PAYMENT METHOD:</span> {invoiceData.paymentMethod}
            </p>
          </div>
        </div>
        
        {/* Items Table */}
        <table style={styles.itemsTable}>
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
              <tr key={item._id || index}>
                <td style={styles.tableTd}>{String(index + 1).padStart(2, '0')}</td>
                <td style={styles.tableTd}>{item.title}</td>
                <td style={styles.tableTdCenter}>{formatCurrency(item.price, settings.currencySymbol)}</td>
                <td style={styles.tableTdCenter}>{String(item.quantity).padStart(2, '0')}</td>
                <td style={styles.tableTdCenter}>{formatCurrency(item.total, settings.currencySymbol)}</td>
              </tr>
            ))}
            
            {/* Subtotal Row */}
            <tr>
              <td style={styles.tableTd} colSpan={2}></td>
              <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px', fontWeight: 'bold'}} colSpan={2}>
                Sub Total
              </td>
              <td style={styles.tableTdCenter}>{formatCurrency(invoiceData.subtotal, settings.currencySymbol)}</td>
            </tr>
            
            {/* Shipping Cost Row */}
            {invoiceData.shippingCost > 0 && (
              <tr>
                <td style={styles.tableTd} colSpan={2}></td>
                <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px'}} colSpan={2}>
                  Shipping Cost
                </td>
                <td style={styles.tableTdCenter}>{formatCurrency(invoiceData.shippingCost, settings.currencySymbol)}</td>
              </tr>
            )}
            
            {/* Discount Row */}
            {invoiceData.discount > 0 && (
              <tr>
                <td style={styles.tableTd} colSpan={2}></td>
                <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px'}} colSpan={2}>
                  Discount
                </td>
                <td style={styles.tableTdCenter}>-{formatCurrency(invoiceData.discount, settings.currencySymbol)}</td>
              </tr>
            )}
            
            {/* Tax Row */}
            {settings.showTax && invoiceData.tax > 0 && (
              <tr>
                <td style={styles.tableTd} colSpan={2}></td>
                <td style={{...styles.tableTdCenter, textAlign: 'right', paddingRight: '20px'}} colSpan={2}>
                  VAT Tax {settings.taxRate}%
                </td>
                <td style={styles.tableTdCenter}>{formatCurrency(invoiceData.tax, settings.currencySymbol)}</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Grand Total */}
        <div style={styles.grandTotalSection}>
          <table style={styles.grandTotalTable}>
            <tbody>
              <tr>
                <td style={styles.grandTotalLabel}>GRAND TOTAL</td>
                <td style={styles.grandTotalAmount}>{formatCurrency(invoiceData.total, settings.currencySymbol)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Payment Info */}
        <div style={styles.paymentInfo}>
          <h3 style={{fontSize: '14px', fontStyle: 'italic', fontWeight: 'normal', color: invoiceColors.secondaryText, textAlign: 'center', margin: '20px 0'}}>
            {settings.footerText || 'This is a Computer Generated Invoice'}
          </h3>
        </div>
        
        {/* Thank You Section */}
        {settings.showThankYouMessage && (
          <div style={styles.thankYou}>
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
          <div style={styles.footerItem}>
            <div style={styles.footerIcon}>
              <PhoneIcon style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div>{settings.companyPhone || '0000 00000 00000'}</div>
              <div>{settings.contactPhone || '0000 00000 00000'}</div>
            </div>
          </div>
          <div style={styles.footerItem}>
            <div style={styles.footerIconPink}>
              <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div>{settings.companyEmail || 'yourmail@domainhere'}</div>
              <div>{settings.contactEmail || 'yourmail@domainhere'}</div>
            </div>
          </div>
          <div style={styles.footerItem}>
            <div style={styles.footerIcon}>
              <MapPinIcon style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div>{settings.companyAddress || 'Street Address Here'}</div>
              <div>{settings.companyCity || 'Country-00000'}</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={styles.bottomBar}></div>
      </div>
    </div>
  );
};

export default UnifiedInvoice;