"use client";
import React from "react";
import { InvoiceSettings } from "@/types/invoice-type";
import dayjs from "dayjs";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface Props {
  settings: InvoiceSettings;
}

const InvoicePreview = ({ settings }: Props) => {
  // Sample data for preview matching the HTML template
  const sampleData = {
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
    subtotal: 4600.00,
    tax: 466.00,
    discount: 0.00,
    paymentMethod: "COD"
  };

  const total = sampleData.subtotal + sampleData.tax - sampleData.discount;

  const formatDate = (date: string) => {
    const d = dayjs(date);
    switch (settings.dateFormat) {
      case 'DD/MM/YYYY':
        return d.format('DD/MM/YYYY');
      case 'YYYY-MM-DD':
        return d.format('YYYY-MM-DD');
      default:
        return d.format('DD/MMMM/YYYY'); // Matches "00/July/2045" format
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
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: settings.primaryColor,
          height: '10px'
        }}></div>
        
        {/* Brand Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '30px 40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {settings.showLogo && settings.logo ? (
              <img 
                src={settings.logo} 
                alt="Company Logo" 
                style={{ height: '40px', width: 'auto' }}
              />
            ) : (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `2px solid ${settings.primaryColor}`,
                  transform: 'rotate(45deg)',
                  position: 'relative'
                }}></div>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  letterSpacing: '2px'
                }}>{settings.companyName || 'BRAND'}</span>
              </>
            )}
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: settings.primaryColor
          }}>INVOICE</div>
        </div>
        
        {/* Invoice Details */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px 30px'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '14px',
              marginBottom: '5px'
            }}>Bill To</h3>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>{sampleData.customerName}</div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.4'
            }}>
              {sampleData.customerAddress}<br/>
              {sampleData.customerEmail}, {settings.companyWebsite}<br/>
              {sampleData.customerPhone}, {settings.companyPhone}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '14px',
              marginBottom: '5px'
            }}>
              <span style={{ color: '#666' }}>Invoice No:</span> {sampleData.invoice}
            </p>
            <p style={{
              fontSize: '14px',
              marginBottom: '5px'
            }}>
              <span style={{ color: '#666' }}>Date:</span> {formatDate(sampleData.date)}
            </p>
            <p style={{
              marginTop: '20px',
              fontSize: '14px'
            }}>
              <strong>PAYMENT METHOD:</strong> {sampleData.paymentMethod}
            </p>
          </div>
        </div>
        
        {/* Items Table */}
        <table style={{
          margin: '0 40px 0px',
          borderCollapse: 'collapse',
          width: 'calc(100% - 80px)'
        }}>
          <thead>
            <tr style={{
              backgroundColor: settings.primaryColor,
              color: 'white'
            }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 'normal'
              }}>NO</th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 'normal'
              }}>ITEM DESCRIPTION</th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'normal'
              }}>PRICE</th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'normal'
              }}>QTY</th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'normal'
              }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.items.map((item, index) => (
              <tr key={item._id}>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  fontSize: '12px'
                }}>{item._id}</td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  fontSize: '12px'
                }}>{item.title}</td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>{settings.currencySymbol} {item.price}</td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>{item.quantity}</td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>{settings.currencySymbol} {item.total.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '12px' }}></td>
              <td colSpan={2} style={{
                textAlign: 'right',
                paddingRight: '20px',
                fontWeight: 'bold',
                border: '1px solid #ddd',
                padding: '12px'
              }}>Sub Total</td>
              <td style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                padding: '12px'
              }}>{settings.currencySymbol} {sampleData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '12px' }}></td>
              <td colSpan={2} style={{
                textAlign: 'right',
                paddingRight: '20px',
                border: '1px solid #ddd',
                padding: '12px'
              }}>Shipping Cost</td>
              <td style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                padding: '12px'
              }}>{settings.currencySymbol} 60.00</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '12px' }}></td>
              <td colSpan={2} style={{
                textAlign: 'right',
                paddingRight: '20px',
                border: '1px solid #ddd',
                padding: '12px'
              }}>Discount</td>
              <td style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                padding: '12px'
              }}>{settings.currencySymbol} {sampleData.discount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '12px' }}></td>
              <td colSpan={2} style={{
                textAlign: 'right',
                paddingRight: '20px',
                border: '1px solid #ddd',
                padding: '12px'
              }}>Vat tax 10%</td>
              <td style={{
                textAlign: 'center',
                border: '1px solid #ddd',
                padding: '12px'
              }}>{settings.currencySymbol} {sampleData.tax.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        {/* Grand Total */}
        <div style={{ margin: '0 40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{
                backgroundColor: settings.primaryColor,
                color: 'white',
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'center',
                border: `1px solid ${settings.primaryColor}`
              }}>GRAND TOTAL</td>
              <td style={{
                backgroundColor: '#333',
                color: 'white',
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'center',
                width: '20%',
                border: '1px solid #333'
              }}>{settings.currencySymbol} {(sampleData.subtotal + 60 + sampleData.tax - sampleData.discount).toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        {/* Computer Generated Invoice */}
        <div style={{ margin: '30px 40px' }}>
          <h3 style={{
            fontSize: '14px',
            fontStyle: 'italic',
            fontWeight: 'normal',
            color: '#666'
          }}>This is a Computer Generated Invoice</h3>
        </div>
        
        {/* Thank You Section */}
        <div style={{
          margin: '30px 40px',
          paddingTop: '30px',
          borderTop: '1px solid #ddd'
        }}>
          <h3 style={{
            fontSize: '16px',
            marginBottom: '10px'
          }}>{settings.thankYouMessage || "Thank you for your Business!"}</h3>
          <p style={{
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '10px'
          }}>
            <strong>Terms:</strong> {settings.termsAndConditions || "Payment is due within 30 days of invoice date. Late payments may incur additional charges. All services are subject to our standard terms and conditions. For questions regarding this invoice, please contact our billing department."}
          </p>
          <div style={{
            textAlign: 'right',
            marginTop: '20px'
          }}>
            <p style={{
              fontSize: '14px',
              fontStyle: 'italic'
            }}>{settings.companyName || 'Your Name Here'}</p>
            <p style={{
              fontSize: '11px',
              fontStyle: 'normal',
              color: '#999'
            }}>Signature Here</p>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '30px 40px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              backgroundColor: settings.primaryColor,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}><PhoneIcon style={{ width: '16px', height: '16px' }} /></div>
            <div>
              <div>{settings.contactPhone || '0000 00000 00000'}</div>
              <div>{settings.companyPhone || '0000 00000 00000'}</div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              backgroundColor: settings.primaryColor,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}><EnvelopeIcon style={{ width: '16px', height: '16px' }} /></div>
            <div>
              <div>{settings.contactEmail || 'yourmail@domainhere'}</div>
              <div>{settings.companyEmail || 'yourmail@domainhere'}</div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              backgroundColor: settings.primaryColor,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}><MapPinIcon style={{ width: '16px', height: '16px' }} /></div>
            <div>
              <div>{settings.contactAddress || 'Street Address Here'}</div>
              <div>{settings.companyCity || 'Country-00000'}</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={{
          backgroundColor: settings.secondaryColor,
          height: '40px'
        }}></div>
      </div>
    </div>
  );
};

export default InvoicePreview;