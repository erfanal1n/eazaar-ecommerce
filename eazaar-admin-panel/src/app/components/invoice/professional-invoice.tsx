"use client";
import React from "react";
import { Order } from "@/types/order-amount-type";
import { InvoiceSettings } from "@/types/invoice-type";
import { useGetInvoiceSettingsQuery } from "@/redux/invoice-settings/invoiceSettingsApi";
import dayjs from "dayjs";

interface Props {
  orderData: Order;
  className?: string;
}

const ProfessionalInvoice = ({ orderData, className = "" }: Props) => {
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

  // Calculate totals using order data
  const subtotal = orderData.cart.reduce((sum, item) => sum + (item.orderQuantity * item.price), 0);
  const tax = settings.showTax ? (subtotal * settings.taxRate / 100) : 0;
  const shippingCost = orderData.shippingCost || 0;
  const discount = orderData.discount || 0;
  const total = subtotal + tax + shippingCost - discount;

  const formatDate = (dateString?: string) => {
    if (!dateString) return dayjs().format('DD/MMMM/YYYY');
    const date = dayjs(dateString);
    switch (settings.dateFormat) {
      case 'DD/MM/YYYY':
        return date.format('DD/MM/YYYY');
      case 'YYYY-MM-DD':
        return date.format('YYYY-MM-DD');
      default:
        return date.format('DD/MMMM/YYYY'); // Matches "00/July/2045" format
    }
  };

  return (
    <div 
      style={{ 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
          color: 'white',
          padding: '30px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Company Info */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              {settings.showLogo && settings.logo && (
                <div style={{ marginBottom: '15px' }}>
                  <img 
                    src={settings.logo} 
                    alt="Company Logo" 
                    style={{ height: '60px', width: 'auto' }}
                  />
                </div>
              )}
              {settings.showCompanyInfo && (
                <div>
                  <h1 style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    margin: '0 0 10px 0',
                    color: 'white'
                  }}>
                    {settings.companyName}
                  </h1>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                    <p style={{ margin: '2px 0' }}>{settings.companyAddress}</p>
                    <p style={{ margin: '2px 0' }}>{settings.companyCity}</p>
                    <p style={{ margin: '2px 0' }}>Phone: {settings.companyPhone}</p>
                    <p style={{ margin: '2px 0' }}>Email: {settings.companyEmail}</p>
                    {settings.companyWebsite && <p style={{ margin: '2px 0' }}>Website: {settings.companyWebsite}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Info */}
            <div style={{ textAlign: 'right', minWidth: '200px' }}>
              <h2 style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                margin: '0 0 15px 0',
                color: 'white'
              }}>
                INVOICE
              </h2>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <p style={{ margin: '5px 0' }}>
                  <span style={{ color: '#666' }}>Invoice No:</span> {settings.invoicePrefix}-{orderData.invoice}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <span style={{ color: '#666' }}>Date:</span> {formatDate(orderData.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Customer Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* Bill To */}
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: settings.primaryColor,
                marginBottom: '15px',
                borderBottom: `2px solid ${settings.primaryColor}`,
                paddingBottom: '8px'
              }}>
                Bill To:
              </h3>
              <div style={{ lineHeight: '1.6', color: '#333' }}>
                <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '5px 0' }}>{orderData.name}</p>
                <p style={{ margin: '3px 0' }}>{orderData.address}</p>
                <p style={{ margin: '3px 0' }}>{orderData.city}, {orderData.country} {orderData.zipCode}</p>
                <p style={{ margin: '3px 0' }}>Phone: {orderData.contact}</p>
                <p style={{ margin: '3px 0' }}>Email: {orderData.email}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: settings.primaryColor,
                marginBottom: '15px',
                borderBottom: `2px solid ${settings.primaryColor}`,
                paddingBottom: '8px'
              }}>
                Invoice Details:
              </h3>
              <div style={{ lineHeight: '1.6', color: '#333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                  <span style={{ fontWeight: '500' }}>Payment Method:</span>
                  <span>{orderData.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                  <span style={{ fontWeight: '500' }}>Shipping Option:</span>
                  <span>{orderData.shippingOption}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                  <span style={{ fontWeight: '500' }}>Order Status:</span>
                  <span style={{ textTransform: 'capitalize' }}>{orderData.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: settings.primaryColor, 
                  color: 'white'
                }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '15px 10px', 
                    fontWeight: 'bold',
                    borderBottom: '1px solid #ddd'
                  }}>
                    Description
                  </th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '15px 10px', 
                    fontWeight: 'bold',
                    borderBottom: '1px solid #ddd'
                  }}>
                    Qty
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '15px 10px', 
                    fontWeight: 'bold',
                    borderBottom: '1px solid #ddd'
                  }}>
                    Unit Price
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '15px 10px', 
                    fontWeight: 'bold',
                    borderBottom: '1px solid #ddd'
                  }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.cart.map((item, index) => (
                  <tr key={item._id} style={{ 
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                    borderBottom: '1px solid #eee'
                  }}>
                    <td style={{ 
                      padding: '12px 10px',
                      borderBottom: '1px solid #eee'
                    }}>
                      <div>
                        <p style={{ fontWeight: '500', margin: '0', color: '#333' }}>{item.title}</p>
                        {item.category && (
                          <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>
                            Category: {item.category.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      textAlign: 'center', 
                      padding: '12px 10px',
                      fontWeight: '500',
                      borderBottom: '1px solid #eee'
                    }}>
                      {item.orderQuantity}
                    </td>
                    <td style={{ 
                      textAlign: 'right', 
                      padding: '12px 10px',
                      borderBottom: '1px solid #eee'
                    }}>
                      {settings.currencySymbol}{item.price.toFixed(2)}
                    </td>
                    <td style={{ 
                      textAlign: 'right', 
                      padding: '12px 10px',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #eee'
                    }}>
                      {settings.currencySymbol}{(item.orderQuantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            marginBottom: '30px'
          }}>
            <div style={{ 
              width: '300px',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '14px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  paddingBottom: '8px'
                }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: '500' }}>{settings.currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                
                {settings.showTax && tax > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    paddingBottom: '8px'
                  }}>
                    <span>Tax ({settings.taxRate}%):</span>
                    <span style={{ fontWeight: '500' }}>{settings.currencySymbol}{tax.toFixed(2)}</span>
                  </div>
                )}
                
                {shippingCost > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    paddingBottom: '8px'
                  }}>
                    <span>Shipping:</span>
                    <span style={{ fontWeight: '500' }}>{settings.currencySymbol}{shippingCost.toFixed(2)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    paddingBottom: '8px'
                  }}>
                    <span>Discount:</span>
                    <span style={{ fontWeight: '500' }}>-{settings.currencySymbol}{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  paddingTop: '12px',
                  borderTop: `2px solid ${settings.accentColor}`,
                  color: settings.accentColor
                }}>
                  <span>Total:</span>
                  <span>{settings.currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          {settings.showThankYouMessage && settings.thankYouMessage && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: `${settings.accentColor}15`,
              border: `2px solid ${settings.accentColor}`,
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: settings.accentColor,
                margin: '0'
              }}>
                {settings.thankYouMessage}
              </h3>
            </div>
          )}

          {/* Terms and Conditions */}
          {settings.termsAndConditions && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: settings.primaryColor,
                fontSize: '16px'
              }}>
                Terms & Conditions:
              </h4>
              <p style={{ 
                fontSize: '12px', 
                color: '#666', 
                lineHeight: '1.5',
                margin: '0'
              }}>
                {settings.termsAndConditions}
              </p>
            </div>
          )}

          {/* Signature */}
          {settings.showSignature && settings.signature && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: settings.primaryColor,
                fontSize: '16px'
              }}>
                Authorized Signature:
              </h4>
              <img 
                src={settings.signature} 
                alt="Signature" 
                style={{ 
                  height: '60px', 
                  width: 'auto',
                  border: '1px solid #ddd',
                  padding: '8px',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: settings.secondaryColor,
          color: 'white',
          padding: '25px 30px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginBottom: '15px'
          }}>
            <div>
              <h5 style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '14px' }}>Phone</h5>
              <p style={{ fontSize: '12px', opacity: '0.9', margin: '0' }}>{settings.contactPhone}</p>
            </div>
            <div>
              <h5 style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '14px' }}>Email</h5>
              <p style={{ fontSize: '12px', opacity: '0.9', margin: '0' }}>{settings.contactEmail}</p>
            </div>
            <div>
              <h5 style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '14px' }}>Address</h5>
              <p style={{ fontSize: '12px', opacity: '0.9', margin: '0' }}>{settings.contactAddress}</p>
            </div>
          </div>
          
          {settings.footerText && (
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '15px'
            }}>
              <p style={{ fontSize: '12px', opacity: '0.75', margin: '0' }}>
                {settings.footerText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInvoice;