export interface InvoiceSettings {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  logo: string;

  // Contact Information (Footer)
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;

  // Signature
  signature: string;
  showSignature: boolean;

  // Design Settings
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;

  // Display Options
  showLogo: boolean;
  showCompanyInfo: boolean;
  showThankYouMessage: boolean;
  thankYouMessage: string;
  footerText: string;
  termsAndConditions: string;

  // Invoice Settings
  invoicePrefix: string;
  taxRate: number;
  taxLabel: string;
  showTax: boolean;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  
  // Pricing Settings
  shippingCost: number;
  discountAmount: number;
  showShipping: boolean;
  showDiscount: boolean;

  // Payment Terms
  paymentTerms: string;
  lateFee: number;

  // Style Options
  showBorder: boolean;
  borderRadius: string;
}

export interface InvoiceData {
  invoice: number;
  date: string;
  dueDate?: string;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerPhone: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  notes?: string;
}

export interface InvoiceItem {
  _id: string;
  title: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}