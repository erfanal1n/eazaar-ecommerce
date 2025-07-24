const { Schema, model } = require("mongoose");

const invoiceSettingsSchema = new Schema(
  {
    // Company Information
    companyName: {
      type: String,
      default: "Your Company Name"
    },
    companyAddress: {
      type: String,
      default: "123 Business Street"
    },
    companyCity: {
      type: String,
      default: "City, State 12345"
    },
    companyPhone: {
      type: String,
      default: "+1 (555) 123-4567"
    },
    companyEmail: {
      type: String,
      default: "info@yourcompany.com"
    },
    companyWebsite: {
      type: String,
      default: "www.yourcompany.com"
    },
    logo: {
      type: String,
      default: ""
    },

    // Contact Information (Footer)
    contactPhone: {
      type: String,
      default: "+01234567890"
    },
    contactEmail: {
      type: String,
      default: "demo@mail.com"
    },
    contactAddress: {
      type: String,
      default: "Your Location Here"
    },

    // Signature
    signature: {
      type: String,
      default: ""
    },
    showSignature: {
      type: Boolean,
      default: false
    },

    // Design Settings
    primaryColor: {
      type: String,
      default: "#3B82F6"
    },
    secondaryColor: {
      type: String,
      default: "#1F2937"
    },
    accentColor: {
      type: String,
      default: "#10B981"
    },
    fontFamily: {
      type: String,
      default: "Inter"
    },

    // Display Options
    showLogo: {
      type: Boolean,
      default: true
    },
    showCompanyInfo: {
      type: Boolean,
      default: true
    },
    showThankYouMessage: {
      type: Boolean,
      default: true
    },
    thankYouMessage: {
      type: String,
      default: "Thank you for your business!"
    },
    footerText: {
      type: String,
      default: "This is a computer generated invoice."
    },
    termsAndConditions: {
      type: String,
      default: "Payment is due within 30 days of invoice date. Late payments may incur additional charges."
    },

    // Invoice Settings
    invoicePrefix: {
      type: String,
      default: "INV"
    },
    taxRate: {
      type: Number,
      default: 10
    },
    taxLabel: {
      type: String,
      default: "Vat tax"
    },
    showTax: {
      type: Boolean,
      default: true
    },
    currency: {
      type: String,
      default: "USD"
    },
    currencySymbol: {
      type: String,
      default: "$"
    },
    dateFormat: {
      type: String,
      default: "DD/MMMM/YYYY"
    },
    
    // Pricing Settings
    shippingCost: {
      type: Number,
      default: 60
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    showShipping: {
      type: Boolean,
      default: true
    },
    showDiscount: {
      type: Boolean,
      default: true
    },

    // Payment Terms
    paymentTerms: {
      type: String,
      default: "30"
    },
    lateFee: {
      type: Number,
      default: 0
    },

    // Style Options
    showBorder: {
      type: Boolean,
      default: false
    },
    borderRadius: {
      type: String,
      default: "8px"
    },

    // Admin who created/updated these settings
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  {
    timestamps: true,
  }
);

const InvoiceSettings = model("InvoiceSettings", invoiceSettingsSchema);
module.exports = InvoiceSettings;