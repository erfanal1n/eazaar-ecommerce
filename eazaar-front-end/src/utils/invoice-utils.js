import dayjs from "dayjs";

// Currency formatting utility
export const formatCurrency = (amount, currencySymbol = '$') => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${currencySymbol}${numAmount.toFixed(2)}`;
};

// Date formatting utility
export const formatDate = (dateString, format = 'DD/MMMM/YYYY') => {
  if (!dateString) return dayjs().format(format);
  
  const date = dayjs(dateString);
  switch (format) {
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

// Currency symbol mapping
export const getCurrencySymbol = (currency) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'BDT': '৳'
  };
  return symbols[currency] || '$';
};

// Transform order data to invoice format
export const transformOrderToInvoiceData = (orderData, settings) => {
  if (!orderData) {
    return getSampleInvoiceData();
  }

  const cart = orderData.cart || [];
  const subtotal = cart.reduce((sum, item) => sum + ((item.orderQuantity || 0) * (item.price || 0)), 0);
  const tax = (settings?.showTax && settings?.taxRate) ? (subtotal * settings.taxRate / 100) : 0;
  const shippingCost = orderData.shippingCost || 0;
  const discount = orderData.discount || 0;
  const total = subtotal + tax + shippingCost - discount;

  return {
    invoice: orderData.invoice ? orderData.invoice.toString() : "000000",
    date: orderData.createdAt || new Date().toISOString(),
    customerName: orderData.name || "Customer",
    customerPhone: orderData.contact || "N/A",
    customerEmail: orderData.email || "N/A",
    customerAddress: `${orderData.city || ''}, ${orderData.country || ''}`.trim(),
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
    total,
    paymentMethod: orderData.paymentMethod || 'COD'
  };
};

// Sample invoice data for fallback
export const getSampleInvoiceData = () => {
  return {
    invoice: "000000",
    date: new Date().toISOString(),
    customerName: "Sample Customer",
    customerPhone: "0000 0000 0000",
    customerEmail: "customer@example.com",
    customerAddress: "Sample Address, City, Country",
    items: [
      {
        _id: "1",
        title: "Sample Product",
        quantity: 1,
        price: 100,
        total: 100
      }
    ],
    subtotal: 100,
    tax: 10,
    shippingCost: 10,
    discount: 0,
    total: 120,
    paymentMethod: 'COD'
  };
};

// Default invoice settings - matches backend model defaults
export const getDefaultInvoiceSettings = () => {
  return {
    companyName: "Your Company Name",
    companyAddress: "123 Business Street",
    companyCity: "City, State 12345",
    companyPhone: "+1 (555) 123-4567",
    companyEmail: "info@yourcompany.com",
    companyWebsite: "www.yourcompany.com",
    contactPhone: "+01234567890",
    contactEmail: "demo@mail.com",
    contactAddress: "Your Location Here",
    primaryColor: "#3B82F6",
    secondaryColor: "#1F2937",
    accentColor: "#10B981",
    fontFamily: "Inter",
    showLogo: true,
    showCompanyInfo: true,
    showSignature: false,
    showThankYouMessage: true,
    showTax: false,
    showBorder: false,
    invoicePrefix: "INV",
    currency: "USD",
    currencySymbol: "$",
    dateFormat: "MM/DD/YYYY",
    taxRate: 0,
    thankYouMessage: "Thank you for your business!",
    footerText: "This is a computer generated invoice.",
    termsAndConditions: "Payment is due within 30 days of invoice date. Late payments may incur additional charges.",
    borderRadius: "8px",
    logo: "",
    signature: ""
  };
};