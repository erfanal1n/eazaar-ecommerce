const mongoose = require('mongoose');

const currencyConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Currency name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Currency code is required'],
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3
  },
  symbol: {
    type: String,
    required: [true, 'Currency symbol is required'],
    trim: true
  },
  position: {
    type: String,
    enum: ['before', 'after'],
    default: 'before',
    required: true
  },
  decimals: {
    type: Number,
    default: 2,
    min: 0,
    max: 4
  },
  thousandsSeparator: {
    type: String,
    default: ',',
    maxlength: 1
  },
  decimalSeparator: {
    type: String,
    default: '.',
    maxlength: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  exchangeRate: {
    type: Number,
    default: 1,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  locale: {
    type: String,
    trim: true,
    default: 'en-US'
  }
}, {
  timestamps: true
});

// Index for better performance
currencyConfigSchema.index({ code: 1 });
currencyConfigSchema.index({ isDefault: 1 });
currencyConfigSchema.index({ isActive: 1 });

// Ensure only one default currency
currencyConfigSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default from all other currencies
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Virtual for formatted display
currencyConfigSchema.virtual('displayName').get(function() {
  return `${this.name} (${this.code})`;
});

// Instance method to format amount
currencyConfigSchema.methods.formatAmount = function(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  // Convert to this currency if needed (using exchange rate)
  const convertedAmount = amount * this.exchangeRate;
  
  // Format with decimals and separators
  const parts = convertedAmount.toFixed(this.decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
  
  let formattedAmount = parts.join(this.decimalSeparator);
  
  // Add currency symbol based on position
  if (this.position === 'before') {
    return `${this.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${this.symbol}`;
  }
};

// Static method to get default currency
currencyConfigSchema.statics.getDefault = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

// Static method to get all active currencies
currencyConfigSchema.statics.getActive = function() {
  return this.find({ isActive: true }).sort({ isDefault: -1, name: 1 });
};

const CurrencyConfig = mongoose.model('CurrencyConfig', currencyConfigSchema);

module.exports = CurrencyConfig;