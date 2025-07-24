const mongoose = require('mongoose');

const sliderShapeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['decorative', 'geometric', 'organic', 'abstract', 'icon', 'pattern'],
    default: 'decorative'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Cloudinary Integration
  cloudinaryId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  
  // Image Properties
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    aspectRatio: { type: Number }
  },
  format: {
    type: String,
    enum: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    required: true
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  
  // Default Styling
  defaultStyling: {
    opacity: { type: Number, min: 0, max: 1, default: 1 },
    mixBlendMode: { 
      type: String, 
      enum: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
      default: 'normal'
    },
    transform: {
      scale: { type: Number, default: 1 },
      rotate: { type: Number, default: 0 },
      translateX: { type: String, default: '0px' },
      translateY: { type: String, default: '0px' }
    }
  },
  
  // Default Position
  defaultPosition: {
    desktop: {
      top: { type: String, default: 'auto' },
      right: { type: String, default: 'auto' },
      bottom: { type: String, default: 'auto' },
      left: { type: String, default: 'auto' },
      zIndex: { type: Number, default: -1 }
    },
    tablet: {
      top: { type: String, default: 'auto' },
      right: { type: String, default: 'auto' },
      bottom: { type: String, default: 'auto' },
      left: { type: String, default: 'auto' },
      zIndex: { type: Number, default: -1 }
    },
    mobile: {
      top: { type: String, default: 'auto' },
      right: { type: String, default: 'auto' },
      bottom: { type: String, default: 'auto' },
      left: { type: String, default: 'auto' },
      zIndex: { type: Number, default: -1 }
    }
  },
  
  // Default Animation
  defaultAnimation: {
    enabled: { type: Boolean, default: false },
    type: { 
      type: String, 
      enum: ['float', 'rotate', 'pulse', 'bounce', 'swing', 'none'], 
      default: 'none' 
    },
    duration: { type: Number, default: 3 },
    delay: { type: Number, default: 0 },
    iteration: { type: String, enum: ['infinite', 'once', 'twice'], default: 'infinite' },
    direction: { type: String, enum: ['normal', 'reverse', 'alternate'], default: 'normal' }
  },
  
  // Usage Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Creator Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // SEO & Metadata
  seo: {
    alt: { type: String },
    title: { type: String },
    keywords: [{ type: String }]
  }
}, {
  timestamps: true
});

// Indexes for performance
sliderShapeSchema.index({ category: 1 });
sliderShapeSchema.index({ tags: 1 });
sliderShapeSchema.index({ isActive: 1 });
sliderShapeSchema.index({ isPublic: 1 });
sliderShapeSchema.index({ usageCount: -1 });
sliderShapeSchema.index({ createdAt: -1 });

// Compound indexes
sliderShapeSchema.index({ category: 1, isActive: 1, isPublic: 1 });
sliderShapeSchema.index({ tags: 1, isActive: 1, isPublic: 1 });

// Virtual for full Cloudinary URL with transformations
sliderShapeSchema.virtual('optimizedUrl').get(function() {
  return this.url.replace('/upload/', '/upload/f_auto,q_auto/');
});

// Methods
sliderShapeSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

sliderShapeSchema.methods.getTransformedUrl = function(transformations = {}) {
  const { width, height, quality = 'auto', format = 'auto' } = transformations;
  let transformString = `f_${format},q_${quality}`;
  
  if (width) transformString += `,w_${width}`;
  if (height) transformString += `,h_${height}`;
  
  return this.url.replace('/upload/', `/upload/${transformString}/`);
};

module.exports = mongoose.model('SliderShape', sliderShapeSchema);