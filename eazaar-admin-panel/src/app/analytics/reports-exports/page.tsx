'use client';
import React, { useState } from 'react';
import Wrapper from '@/layout/wrapper';
import Breadcrumb from '@/app/components/breadcrumb/breadcrumb';
import { useGetReportsDataQuery, useGetSalesReportDataQuery, useGetCustomerReportDataQuery, useGetProductReportDataQuery } from '@/redux/analytics/analyticsApi';
import { Download, FileText, Calendar, Filter, Analytics } from '@/svg';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'sales' | 'customers' | 'products' | 'financial';
}

const ReportsExportsPage = () => {
  const { data: reportsData, isLoading, error } = useGetReportsDataQuery();
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const reportTypes: ReportType[] = [
    {
      id: 'sales-summary',
      name: 'Sales Summary Report',
      description: 'Comprehensive overview of sales performance, revenue trends, and order analytics',
      icon: <Analytics className="w-6 h-6" />,
      category: 'sales'
    },
    {
      id: 'customer-insights',
      name: 'Customer Analytics Report',
      description: 'Customer behavior, demographics, retention rates, and lifetime value analysis',
      icon: <FileText className="w-6 h-6" />,
      category: 'customers'
    },
    {
      id: 'product-performance',
      name: 'Product Performance Report',
      description: 'Top-selling products, inventory levels, and category performance metrics',
      icon: <FileText className="w-6 h-6" />,
      category: 'products'
    },
    {
      id: 'financial-overview',
      name: 'Financial Overview Report',
      description: 'Revenue breakdown, profit margins, and financial KPI analysis',
      icon: <Analytics className="w-6 h-6" />,
      category: 'financial'
    }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'thisyear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', extension: '.pdf' },
    { value: 'excel', label: 'Excel Spreadsheet', extension: '.xlsx' },
    { value: 'csv', label: 'CSV File', extension: '.csv' }
  ];

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId);
    
    try {
      // Fetch real data based on report type using the correct API base URL
      let realData = null;
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/api';
      
      if (reportId === 'sales-summary' || reportId === 'financial-overview') {
        const response = await fetch(`${baseUrl}/analytics/sales-report?dateRange=${selectedDateRange}`);
        const result = await response.json();
        realData = result.success ? result.data : null;
      } else if (reportId === 'customer-insights') {
        const response = await fetch(`${baseUrl}/analytics/customer-report?dateRange=${selectedDateRange}`);
        const result = await response.json();
        realData = result.success ? result.data : null;
      } else if (reportId === 'product-performance') {
        const response = await fetch(`${baseUrl}/analytics/product-report?dateRange=${selectedDateRange}`);
        const result = await response.json();
        realData = result.success ? result.data : null;
      }
      
      console.log(`Fetched data for ${reportId}:`, realData);
      
      // Create and download the report with real data
      const reportData = generateReportData(reportId, realData);
      downloadReport(reportData, reportId);
      
    } catch (error) {
      console.error('Error generating report:', error);
      // Generate report with fallback message
      const reportData = generateReportData(reportId, null);
      downloadReport(reportData, reportId);
    } finally {
      setGeneratingReport(null);
    }
  };

  const generateReportData = (reportId: string, realData?: any) => {
    const report = reportTypes.find(r => r.id === reportId);
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (selectedFormat === 'csv') {
      return generateCSVData(reportId, realData);
    } else if (selectedFormat === 'excel') {
      return generateExcelData(reportId, realData);
    } else {
      return generatePDFData(reportId, realData);
    }
  };

  const generateCSVData = (reportId: string, realData?: any) => {
    const headers = getReportHeaders(reportId);
    const data = getReportData(reportId, realData);
    const report = reportTypes.find(r => r.id === reportId);
    const timestamp = new Date().toLocaleDateString();
    
    // Create proper CSV with header information
    let csv = `"${report?.name}"\n`;
    csv += `"Generated on: ${timestamp}"\n`;
    csv += `"Date Range: ${selectedDateRange}"\n`;
    csv += `"Description: ${report?.description}"\n\n`;
    
    // Add column headers
    csv += headers.map(header => `"${header}"`).join(',') + '\n';
    
    // Add data rows with proper escaping
    data.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    return csv;
  };

  const generateExcelData = (reportId: string, realData?: any) => {
    // Generate Excel-compatible CSV with proper formatting
    const headers = getReportHeaders(reportId);
    const data = getReportData(reportId, realData);
    const report = reportTypes.find(r => r.id === reportId);
    const timestamp = new Date().toLocaleDateString();
    
    // Excel-compatible CSV with UTF-8 BOM
    let csv = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    csv += `${report?.name}\n`;
    csv += `Generated on: ${timestamp}\n`;
    csv += `Date Range: ${selectedDateRange}\n`;
    csv += `Description: ${report?.description}\n\n`;
    
    // Headers
    csv += headers.join(',') + '\n';
    
    // Data with proper number formatting for Excel
    data.forEach(row => {
      const formattedRow = row.map(cell => {
        // Check if cell is a number
        if (!isNaN(parseFloat(cell)) && isFinite(cell)) {
          return cell; // Keep numbers as is for Excel
        }
        return `"${cell}"`; // Quote text fields
      });
      csv += formattedRow.join(',') + '\n';
    });
    
    return csv;
  };

  const generatePDFData = (reportId: string, realData?: any) => {
    const headers = getReportHeaders(reportId);
    const data = getReportData(reportId, realData);
    const report = reportTypes.find(r => r.id === reportId);
    const timestamp = new Date().toLocaleDateString();
    
    // Generate proper HTML that can be printed or converted to PDF
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${report?.name}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
        }
        .header { 
            border-bottom: 2px solid #007bff; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
        }
        .title { 
            color: #007bff; 
            font-size: 24px; 
            margin: 0; 
        }
        .meta { 
            color: #666; 
            margin: 5px 0; 
        }
        .description { 
            background: #f8f9fa; 
            padding: 10px; 
            border-left: 4px solid #007bff; 
            margin: 15px 0; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        th { 
            background-color: #007bff; 
            color: white; 
            font-weight: bold; 
        }
        tr:nth-child(even) { 
            background-color: #f2f2f2; 
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 10px; 
            border-top: 1px solid #ddd; 
            color: #666; 
            font-size: 12px; 
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${report?.name}</h1>
        <div class="meta">Generated on: ${timestamp}</div>
        <div class="meta">Date Range: ${selectedDateRange}</div>
    </div>
    
    <div class="description">
        <strong>Description:</strong> ${report?.description}
    </div>
    
    <table>
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${data.map(row => `
                <tr>
                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <p>This report was generated by EAZAAR Admin Panel on ${new Date().toLocaleString()}</p>
        <p class="no-print">To save as PDF: Use your browser's Print function and select "Save as PDF"</p>
    </div>
    
    <script>
        // Auto-print when opened (optional)
        // window.onload = function() { window.print(); }
    </script>
</body>
</html>`;
  };

  const getReportHeaders = (reportId: string) => {
    switch (reportId) {
      case 'sales-summary':
        return ['Date', 'Orders', 'Revenue', 'Average Order Value'];
      case 'customer-insights':
        return ['Customer ID', 'Name', 'Email', 'Total Orders', 'Total Spent'];
      case 'product-performance':
        return ['Product ID', 'Name', 'Category', 'Units Sold', 'Revenue'];
      case 'financial-overview':
        return ['Period', 'Revenue', 'Costs', 'Profit', 'Margin %'];
      default:
        return ['Data'];
    }
  };

  const getReportData = (reportId: string, realData?: any) => {
    if (!realData || realData.length === 0) {
      return [['No data available for the selected date range']];
    }

    switch (reportId) {
      case 'sales-summary':
        return realData.map((item: any) => [
          item.date,
          item.orders,
          `$${item.revenue.toFixed(2)}`,
          `$${item.avgOrderValue.toFixed(2)}`
        ]);
        
      case 'customer-insights':
        return realData.map((item: any) => [
          item.customerId,
          item.name,
          item.email,
          item.totalOrders,
          `$${item.totalSpent.toFixed(2)}`
        ]);
        
      case 'product-performance':
        return realData.map((item: any) => [
          item.productId,
          item.name,
          item.category,
          item.unitsSold,
          `$${item.revenue.toFixed(2)}`
        ]);
        
      case 'financial-overview':
        // For financial overview, we'll aggregate the sales data by month
        const monthlyData: { [key: string]: { revenue: number, orders: number } } = {};
        
        realData.forEach((item: any) => {
          const month = item.date.substring(0, 7); // Get YYYY-MM
          if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, orders: 0 };
          }
          monthlyData[month].revenue += item.revenue;
          monthlyData[month].orders += item.orders;
        });
        
        return Object.entries(monthlyData).map(([month, data]) => {
          const costs = data.revenue * 0.7; // Assume 70% costs
          const profit = data.revenue - costs;
          const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;
          
          return [
            month,
            `$${data.revenue.toFixed(2)}`,
            `$${costs.toFixed(2)}`,
            `$${profit.toFixed(2)}`,
            `${margin.toFixed(1)}%`
          ];
        });
        
      default:
        return [['No data available']];
    }
  };

  const downloadReport = (data: string, reportId: string) => {
    const report = reportTypes.find(r => r.id === reportId);
    const format = formatOptions.find(f => f.value === selectedFormat);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${report?.name.replace(/\s+/g, '_')}_${timestamp}${format?.extension}`;
    
    let mimeType = 'text/plain';
    
    if (selectedFormat === 'csv') {
      mimeType = 'text/csv;charset=utf-8;';
    } else if (selectedFormat === 'excel') {
      mimeType = 'application/vnd.ms-excel;charset=utf-8;';
    } else if (selectedFormat === 'pdf') {
      mimeType = 'text/html;charset=utf-8;';
      // For PDF format, open in new window so user can print to PDF
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(data);
        newWindow.document.close();
        return; // Don't download, just open for printing
      }
    }
    
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
          <Breadcrumb title="Reports & Exports" subtitle="Loading reports data..." />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Reports & Exports" subtitle="Generate and download business reports" />
        {/* breadcrumb end */}

        {/* Summary Stats */}
        {reportsData && (
          <div className="grid grid-cols-12 gap-3 sm:gap-6 mb-6">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-8 col-span-12 lg:col-span-3 rounded-md transition-colors duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-heading dark:text-white mb-1">
                  ${reportsData.summary.monthlyRevenue.toLocaleString()}
                </h3>
                <p className="text-textBody dark:text-slate-300 text-sm">Monthly Revenue</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-8 col-span-12 lg:col-span-3 rounded-md transition-colors duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-heading dark:text-white mb-1">
                  ${reportsData.summary.yearlyRevenue.toLocaleString()}
                </h3>
                <p className="text-textBody dark:text-slate-300 text-sm">Yearly Revenue</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-8 col-span-12 lg:col-span-3 rounded-md transition-colors duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-heading dark:text-white mb-1">
                  {reportsData.summary.monthlyOrders.toLocaleString()}
                </h3>
                <p className="text-textBody dark:text-slate-300 text-sm">Monthly Orders</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-8 col-span-12 lg:col-span-3 rounded-md transition-colors duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-heading dark:text-white mb-1">
                  {reportsData.summary.yearlyOrders.toLocaleString()}
                </h3>
                <p className="text-textBody dark:text-slate-300 text-sm">Yearly Orders</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Generation Area */}
        <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
          <div className="overflow-scroll 2xl:overflow-visible">
            <div className="w-[1500px] xl:w-full">
              
              {/* Report Controls */}
              <div className="tp-search-box flex items-center justify-between px-8 py-8">
                <div className="flex items-center space-x-6">
                  <div className="search-select flex items-center space-x-3">
                    <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                      Date Range:
                    </span>
                    <select 
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                    >
                      {dateRangeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="search-select flex items-center space-x-3">
                    <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                      Format:
                    </span>
                    <select 
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                    >
                      {formatOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Available Reports Grid */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportTypes.map((report) => (
                    <div
                      key={report.id}
                      className="border border-gray6 dark:border-slate-600 rounded-md p-6 bg-white dark:bg-slate-800 transition-colors duration-300"
                    >
                      <div className="flex items-start mb-4">
                        <div className="mr-4 p-2 bg-theme/10 rounded-md">
                          {report.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-heading dark:text-white mb-2">
                            {report.name}
                          </h4>
                          <span className="inline-block px-3 py-1 text-tiny bg-gray rounded-full text-textBody dark:text-slate-300 capitalize">
                            {report.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-textBody dark:text-slate-300 mb-6 text-sm leading-relaxed">
                        {report.description}
                      </p>
                      
                      <button
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={generatingReport === report.id}
                        className="tp-btn w-full"
                      >
                        {generatingReport === report.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2 inline-block" />
                            Generate Report
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Help Section */}
                <div className="mt-8 p-6 bg-gray/20 dark:bg-slate-700/30 border border-gray6 dark:border-slate-600 rounded-md">
                  <h4 className="text-lg font-medium text-heading dark:text-white mb-3">
                    Report Generation Guide
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-heading dark:text-white mb-2">Before Generating:</h5>
                      <ul className="text-tiny text-textBody dark:text-slate-300 space-y-1">
                        <li>• Select your preferred date range</li>
                        <li>• Choose the export format you need</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-heading dark:text-white mb-2">Export Options:</h5>
                      <ul className="text-tiny text-textBody dark:text-slate-300 space-y-1">
                        <li>• PDF: Opens in new window for printing</li>
                        <li>• Excel/CSV: Downloads automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ReportsExportsPage;