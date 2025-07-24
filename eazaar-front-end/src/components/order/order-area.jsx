'use client';
import React, { useRef } from "react";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetUserOrderByIdQuery } from "@/redux/features/order/orderApi";
import PrdDetailsLoader from "@/components/loader/prd-details-loader";
import UnifiedInvoice from "@/components/invoice/unified-invoice";


const OrderArea = ({ orderId }) => {
  const printRef = useRef();
  const { data: order, isError, isLoading } = useGetUserOrderByIdQuery(orderId);

  // Simple print handler - prints only the invoice content on the same page
  const handleSimplePrint = () => {
    // Add print-specific styles that hide everything except the invoice
    const printStyleId = 'invoice-print-styles';
    
    // Remove any existing print styles
    const existingStyles = document.getElementById(printStyleId);
    if (existingStyles) {
      existingStyles.remove();
    }
    
    // Create new print styles
    const printStyles = document.createElement('style');
    printStyles.id = printStyleId;
    printStyles.innerHTML = `
      @media print {
        /* Hide everything */
        body * {
          visibility: hidden;
          color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        /* Show only the invoice content */
        .tp-invoice-print-wrapper,
        .tp-invoice-print-wrapper * {
          visibility: visible;
        }
        
        /* Position the invoice properly for printing */
        .tp-invoice-print-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white;
        }
        
        /* Hide navigation, headers, footers, and print buttons */
        header, nav, .tp-header-area, .tp-footer-area, 
        .invoice__print, .invoice__msg-wrapper {
          display: none !important;
        }
        
        /* Ensure proper page margins */
        @page {
          margin: 0.5in;
          size: A4;
        }
        
        /* Make sure colors and backgrounds print */
        .tp-invoice-print-wrapper * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        /* Force white background for printing regardless of theme */
        @media print {
          .tp-invoice-print-wrapper {
            background: white !important;
          }
          .tp-invoice-print-wrapper [style*="backgroundColor"] {
            background-color: white !important;
          }
          .tp-invoice-print-wrapper [style*="color: #ffffff"],
          .tp-invoice-print-wrapper [style*="color: #b0b0b0"] {
            color: #333333 !important;
          }
        }
        
        /* Ensure invoice content fills the page properly */
        .invoice__area {
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    `;
    
    // Add the styles to the document
    document.head.appendChild(printStyles);
    
    // Trigger print
    window.print();
    
    // Clean up the print styles after printing
    // We'll keep them for a bit longer to handle slow printers
    setTimeout(() => {
      const styles = document.getElementById(printStyleId);
      if (styles) {
        styles.remove();
      }
    }, 2000);
  };

  // Custom print handler to avoid ReactToPrint issues
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      
      // Extract all computed styles from the current element
      const getAllStyles = (element) => {
        const computedStyles = window.getComputedStyle(element);
        let styleString = '';
        for (let i = 0; i < computedStyles.length; i++) {
          const property = computedStyles[i];
          const value = computedStyles.getPropertyValue(property);
          styleString += `${property}: ${value}; `;
        }
        return styleString;
      };

      // Get all style elements from the parent document
      const styleSheets = Array.from(document.styleSheets);
      let allCSS = '';
      
      try {
        styleSheets.forEach(styleSheet => {
          try {
            if (styleSheet.cssRules) {
              Array.from(styleSheet.cssRules).forEach(rule => {
                allCSS += rule.cssText + '\n';
              });
            }
          } catch (e) {
            // Handle cross-origin stylesheets
            console.warn('Could not access stylesheet:', e);
          }
        });
      } catch (e) {
        console.warn('Error reading stylesheets:', e);
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <meta charset="utf-8">
            <style>
              /* Reset styles */
              * { box-sizing: border-box; }
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif; 
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              /* Print specific styles */
              @media print {
                body { 
                  margin: 0; 
                  padding: 0; 
                  background: white !important;
                }
                .tp-invoice-print-wrapper {
                  padding: 0 !important;
                  background: white !important;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
              
              /* Include all existing styles */
              ${allCSS}
            </style>
          </head>
          <body>
            <div style="background: white; padding: 0;">
              ${printRef.current.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for styles to load before printing
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => printWindow.close(), 100);
      }, 500);
    }
  };
  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading}/>
  }
  if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError) {
    const { name } = order.order;
    content = (
      <>
        <section className="invoice__area pt-120 pb-120">
          <div className="container">
            <div className="invoice__msg-wrapper">
              <div className="row">
                <div className="col-xl-12">
                  <div className="invoice_msg mb-40">
                    <p className="text-black alert alert-success">Thank you <strong>{name}</strong> Your order have been received ! </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="tp-invoice-print-wrapper">
              <div ref={printRef}>
                <UnifiedInvoice 
                  orderData={order.order} 
                  mode="order"
                />
              </div>
            </div>
            <div className="invoice__print text-end mt-3">
              <div className="row">
                <div className="col-xl-12">
                  <button
                    type="button"
                    onClick={handleSimplePrint}
                    className="tp-invoice-print tp-btn tp-btn-black"
                  >
                    <span className="mr-5">
                      <i className="fa-regular fa-print"></i>
                    </span>{" "}
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  
  return (
    <>
      {content}
    </>
  );
};

export default OrderArea;