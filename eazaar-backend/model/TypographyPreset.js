const mongoose = require('mongoose');

const typographyPresetSchema = new mongoose.Schema({
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
    enum: ['modern', 'classic', 'elegant', 'bold', 'minimal', 'decorative'],
    default: 'modern'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Typography Configuration
  typography: {
    // Title Typography
    title: {
      fontFamily: { type: String, default: 'inherit' },
      googleFont: { type: String }, // Google Font name
      fontSize: {
        desktop: { type: String, default: '3rem' },
        tablet: { type: String, default: '2.5rem' },
        mobile: { type: String, default: '2rem' }
      },
      fontWeight: { type: String, default: '700' },
      lineHeight: { type: String, default: '1.2' },
      letterSpacing: { type: String, default: 'normal' },
      textTransform: { type: String, enum: ['none', 'uppercase', 'lowercase', 'capitalize'], default: 'none' },
      
      // Enhanced Effects
      effects: {
        textShadow: {
          enabled: { type: Boolean, default: false },
          offsetX: { type: String, default: '2px' },
          offsetY: { type: String, default: '2px' },
          blurRadius: { type: String, default: '4px' },
          color: { type: String, default: 'rgba(0,0,0,0.3)' },
          multiple: [{
            offsetX: { type: String },
            offsetY: { type: String },
            blurRadius: { type: String },
            color: { type: String }
          }]
        },
        textStroke: {
          enabled: { type: Boolean, default: false },
          width: { type: String, default: '1px' },
          color: { type: String, default: '#000000' }
        },
        gradient: {
          enabled: { type: Boolean, default: false },
          type: { type: String, enum: ['linear', 'radial'], default: 'linear' },
          direction: { type: String, default: 'to right' },
          colors: [{
            color: { type: String, required: true },
            position: { type: Number, min: 0, max: 100, default: 0 }
          }]
        },
        glow: {
          enabled: { type: Boolean, default: false },
          color: { type: String, default: '#ffffff' },
          intensity: { type: Number, min: 0, max: 10, default: 5 }
        }
      }
    },
    
    // Subtitle Typography
    subtitle: {
      fontFamily: { type: String, default: 'inherit' },
      googleFont: { type: String },
      fontSize: {
        desktop: { type: String, default: '1.25rem' },
        tablet: { type: String, default: '1.125rem' },
        mobile: { type: String, default: '1rem' }
      },
      fontWeight: { type: String, default: '400' },
      lineHeight: { type: String, default: '1.4' },
      letterSpacing: { type: String, default: 'normal' },
      textTransform: { type: String, enum: ['none', 'uppercase', 'lowercase', 'capitalize'], default: 'none' },
      
      // Enhanced Effects
      effects: {
        textShadow: {
          enabled: { type: Boolean, default: false },
          offsetX: { type: String, default: '1px' },
          offsetY: { type: String, default: '1px' },
          blurRadius: { type: String, default: '2px' },
          color: { type: String, default: 'rgba(0,0,0,0.3)' }
        },
        textStroke: {
          enabled: { type: Boolean, default: false },
          width: { type: String, default: '1px' },
          color: { type: String, default: '#000000' }
        },
        gradient: {
          enabled: { type: Boolean, default: false },
          type: { type: String, enum: ['linear', 'radial'], default: 'linear' },
          direction: { type: String, default: 'to right' },
          colors: [{
            color: { type: String, required: true },
            position: { type: Number, min: 0, max: 100, default: 0 }
          }]
        }
      }
    },
    
    // Description Typography
    description: {
      fontFamily: { type: String, default: 'inherit' },
      googleFont: { type: String },
      fontSize: {
        desktop: { type: String, default: '1rem' },
        tablet: { type: String, default: '0.875rem' },
        mobile: { type: String, default: '0.875rem' }
      },
      fontWeight: { type: String, default: '400' },
      lineHeight: { type: String, default: '1.6' },
      letterSpacing: { type: String, default: 'normal' },
      textTransform: { type: String, enum: ['none', 'uppercase', 'lowercase', 'capitalize'], default: 'none' },
      
      // Enhanced Effects
      effects: {
        textShadow: {
          enabled: { type: Boolean, default: false },
          offsetX: { type: String, default: '1px' },
          offsetY: { type: String, default: '1px' },
          blurRadius: { type: String, default: '2px' },
          color: { type: String, default: 'rgba(0,0,0,0.3)' }
        }
      }
    },
    
    // Button Typography
    button: {
      fontFamily: { type: String, default: 'inherit' },
      googleFont: { type: String },
      fontSize: {
        desktop: { type: String, default: '1rem' },
        tablet: { type: String, default: '0.875rem' },
        mobile: { type: String, default: '0.875rem' }
      },
      fontWeight: { type: String, default: '600' },
      lineHeight: { type: String, default: '1.2' },
      letterSpacing: { type: String, default: '0.5px' },
      textTransform: { type: String, enum: ['none', 'uppercase', 'lowercase', 'capitalize'], default: 'uppercase' }
    }
  },
  
  // Color Scheme
  colorScheme: {
    primary: { type: String, default: '#ffffff' },
    secondary: { type: String, default: '#e0e0e0' },
    accent: { type: String, default: '#007bff' },
    background: { type: String, default: 'transparent' },
    
    // Context-based colors
    light: {
      title: { type: String, default: '#000000' },
      subtitle: { type: String, default: '#333333' },
      description: { type: String, default: '#666666' },
      button: { type: String, default: '#ffffff' }
    },
    dark: {
      title: { type: String, default: '#ffffff' },
      subtitle: { type: String, default: '#e0e0e0' },
      description: { type: String, default: '#cccccc' },
      button: { type: String, default: '#000000' }
    }
  },
  
  // Responsive Behavior
  responsiveConfig: {
    scaleFactor: {
      tablet: { type: Number, min: 0.5, max: 2, default: 0.9 },
      mobile: { type: Number, min: 0.5, max: 2, default: 0.8 }
    },
    lineHeightAdjustment: {
      tablet: { type: Number, min: 0.5, max: 2, default: 1 },
      mobile: { type: Number, min: 0.5, max: 2, default: 1.1 }
    },
    letterSpacingAdjustment: {
      tablet: { type: Number, min: -2, max: 2, default: 0 },
      mobile: { type: Number, min: -2, max: 2, default: 0 }
    }
  },
  
  // Google Fonts Configuration
  googleFonts: {
    fonts: [{
      family: { type: String, required: true },
      weights: [{ type: String }], // ['300', '400', '700']
      subsets: [{ type: String }], // ['latin', 'latin-ext']
      display: { type: String, enum: ['auto', 'block', 'swap', 'fallback', 'optional'], default: 'swap' }
    }],
    fallbackFonts: [{ type: String }] // System fallback fonts
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
  
  // Preview Configuration
  preview: {
    backgroundColor: { type: String, default: '#ffffff' },
    sampleTitle: { type: String, default: 'Sample Title' },
    sampleSubtitle: { type: String, default: 'Sample Subtitle' },
    sampleDescription: { type: String, default: 'Sample description text for preview' },
    sampleButton: { type: String, default: 'Sample Button' }
  }
}, {
  timestamps: true
});

// Indexes for performance
typographyPresetSchema.index({ category: 1 });
typographyPresetSchema.index({ tags: 1 });
typographyPresetSchema.index({ isActive: 1 });
typographyPresetSchema.index({ isPublic: 1 });
typographyPresetSchema.index({ usageCount: -1 });
typographyPresetSchema.index({ createdAt: -1 });

// Compound indexes
typographyPresetSchema.index({ category: 1, isActive: 1, isPublic: 1 });
typographyPresetSchema.index({ tags: 1, isActive: 1, isPublic: 1 });

// Methods
typographyPresetSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

typographyPresetSchema.methods.getGoogleFontsUrl = function() {
  if (!this.googleFonts.fonts || this.googleFonts.fonts.length === 0) {
    return null;
  }
  
  const fontsQuery = this.googleFonts.fonts.map(font => {
    const weights = font.weights.join(',');
    return `${font.family}:wght@${weights}`;
  }).join('&family=');
  
  const subsets = [...new Set(this.googleFonts.fonts.flatMap(font => font.subsets))];
  const display = this.googleFonts.fonts[0].display || 'swap';
  
  return `https://fonts.googleapis.com/css2?family=${fontsQuery}&subset=${subsets.join(',')}&display=${display}`;
};

typographyPresetSchema.methods.getCSSVariables = function(theme = 'dark') {
  const colors = this.colorScheme[theme] || this.colorScheme.dark;
  const typography = this.typography;
  
  return {
    '--title-font': typography.title.googleFont || typography.title.fontFamily,
    '--title-size-desktop': typography.title.fontSize.desktop,
    '--title-size-tablet': typography.title.fontSize.tablet,
    '--title-size-mobile': typography.title.fontSize.mobile,
    '--title-weight': typography.title.fontWeight,
    '--title-color': colors.title,
    '--title-line-height': typography.title.lineHeight,
    '--title-letter-spacing': typography.title.letterSpacing,
    
    '--subtitle-font': typography.subtitle.googleFont || typography.subtitle.fontFamily,
    '--subtitle-size-desktop': typography.subtitle.fontSize.desktop,
    '--subtitle-size-tablet': typography.subtitle.fontSize.tablet,
    '--subtitle-size-mobile': typography.subtitle.fontSize.mobile,
    '--subtitle-weight': typography.subtitle.fontWeight,
    '--subtitle-color': colors.subtitle,
    '--subtitle-line-height': typography.subtitle.lineHeight,
    '--subtitle-letter-spacing': typography.subtitle.letterSpacing,
    
    '--description-font': typography.description.googleFont || typography.description.fontFamily,
    '--description-size-desktop': typography.description.fontSize.desktop,
    '--description-size-tablet': typography.description.fontSize.tablet,
    '--description-size-mobile': typography.description.fontSize.mobile,
    '--description-weight': typography.description.fontWeight,
    '--description-color': colors.description,
    '--description-line-height': typography.description.lineHeight,
    '--description-letter-spacing': typography.description.letterSpacing,
    
    '--button-font': typography.button.googleFont || typography.button.fontFamily,
    '--button-size-desktop': typography.button.fontSize.desktop,
    '--button-size-tablet': typography.button.fontSize.tablet,
    '--button-size-mobile': typography.button.fontSize.mobile,
    '--button-weight': typography.button.fontWeight,
    '--button-color': colors.button,
    '--button-line-height': typography.button.lineHeight,
    '--button-letter-spacing': typography.button.letterSpacing
  };
};

module.exports = mongoose.model('TypographyPreset', typographyPresetSchema);