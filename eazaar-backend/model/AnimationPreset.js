const mongoose = require('mongoose');

const animationPresetSchema = new mongoose.Schema({
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
    enum: ['entrance', 'exit', 'attention', 'hover', 'continuous'],
    default: 'entrance'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Animation Configuration
  animationConfig: {
    // Title Animation
    title: {
      type: { 
        type: String, 
        enum: ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoomIn', 'zoomOut', 'bounceIn', 'rotateIn', 'flipIn', 'lightSpeedIn', 'none'], 
        default: 'slideUp' 
      },
      duration: { type: Number, min: 0.1, max: 5, default: 0.8 },
      delay: { type: Number, min: 0, max: 3, default: 0.2 },
      easing: { 
        type: String, 
        enum: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'], 
        default: 'ease-out' 
      },
      customCurve: { type: String }, // cubic-bezier values
      distance: { type: Number, default: 30 }, // for slide animations
      scale: { type: Number, default: 0.8 }, // for zoom animations
      rotation: { type: Number, default: 0 } // for rotate animations
    },
    
    // Subtitle Animation
    subtitle: {
      type: { 
        type: String, 
        enum: ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoomIn', 'zoomOut', 'bounceIn', 'rotateIn', 'flipIn', 'lightSpeedIn', 'none'], 
        default: 'slideUp' 
      },
      duration: { type: Number, min: 0.1, max: 5, default: 0.8 },
      delay: { type: Number, min: 0, max: 3, default: 0.4 },
      easing: { 
        type: String, 
        enum: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'], 
        default: 'ease-out' 
      },
      customCurve: { type: String },
      distance: { type: Number, default: 20 },
      scale: { type: Number, default: 0.9 },
      rotation: { type: Number, default: 0 }
    },
    
    // Description Animation
    description: {
      type: { 
        type: String, 
        enum: ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoomIn', 'zoomOut', 'bounceIn', 'rotateIn', 'flipIn', 'lightSpeedIn', 'none'], 
        default: 'slideUp' 
      },
      duration: { type: Number, min: 0.1, max: 5, default: 0.8 },
      delay: { type: Number, min: 0, max: 3, default: 0.6 },
      easing: { 
        type: String, 
        enum: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'], 
        default: 'ease-out' 
      },
      customCurve: { type: String },
      distance: { type: Number, default: 20 },
      scale: { type: Number, default: 0.9 },
      rotation: { type: Number, default: 0 }
    },
    
    // Buttons Animation
    buttons: {
      type: { 
        type: String, 
        enum: ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoomIn', 'zoomOut', 'bounceIn', 'rotateIn', 'flipIn', 'lightSpeedIn', 'none'], 
        default: 'slideUp' 
      },
      duration: { type: Number, min: 0.1, max: 5, default: 0.8 },
      delay: { type: Number, min: 0, max: 3, default: 0.8 },
      easing: { 
        type: String, 
        enum: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'], 
        default: 'ease-out' 
      },
      customCurve: { type: String },
      distance: { type: Number, default: 20 },
      scale: { type: Number, default: 0.8 },
      rotation: { type: Number, default: 0 }
    },
    
    // Image Animation
    image: {
      type: { 
        type: String, 
        enum: ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoomIn', 'zoomOut', 'bounceIn', 'rotateIn', 'flipIn', 'lightSpeedIn', 'none'], 
        default: 'zoomIn' 
      },
      duration: { type: Number, min: 0.1, max: 5, default: 1 },
      delay: { type: Number, min: 0, max: 3, default: 0.3 },
      easing: { 
        type: String, 
        enum: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'], 
        default: 'ease-out' 
      },
      customCurve: { type: String },
      distance: { type: Number, default: 50 },
      scale: { type: Number, default: 0.8 },
      rotation: { type: Number, default: 0 }
    }
  },
  
  // Stagger Configuration
  staggerConfig: {
    enabled: { type: Boolean, default: false },
    interval: { type: Number, min: 0.05, max: 1, default: 0.1 },
    direction: { type: String, enum: ['forward', 'reverse', 'center', 'random'], default: 'forward' },
    from: { type: String, enum: ['first', 'last', 'center', 'edges'], default: 'first' }
  },
  
  // Hover Effects
  hoverEffects: {
    enabled: { type: Boolean, default: false },
    title: { 
      type: String, 
      enum: ['none', 'scale', 'glow', 'shake', 'bounce', 'rotate', 'skew', 'wobble'], 
      default: 'none' 
    },
    subtitle: { 
      type: String, 
      enum: ['none', 'scale', 'glow', 'shake', 'bounce', 'rotate', 'skew', 'wobble'], 
      default: 'none' 
    },
    buttons: { 
      type: String, 
      enum: ['none', 'scale', 'glow', 'shake', 'bounce', 'rotate', 'skew', 'wobble'], 
      default: 'scale' 
    },
    image: { 
      type: String, 
      enum: ['none', 'scale', 'glow', 'shake', 'bounce', 'rotate', 'skew', 'wobble'], 
      default: 'none' 
    }
  },
  
  // Responsive Behavior
  responsiveConfig: {
    desktop: {
      enabled: { type: Boolean, default: true },
      speedMultiplier: { type: Number, min: 0.1, max: 3, default: 1 }
    },
    tablet: {
      enabled: { type: Boolean, default: true },
      speedMultiplier: { type: Number, min: 0.1, max: 3, default: 1.2 }
    },
    mobile: {
      enabled: { type: Boolean, default: true },
      speedMultiplier: { type: Number, min: 0.1, max: 3, default: 1.5 }
    }
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
    textColor: { type: String, default: '#000000' },
    sampleText: { type: String, default: 'Sample Animation' }
  }
}, {
  timestamps: true
});

// Indexes for performance
animationPresetSchema.index({ category: 1 });
animationPresetSchema.index({ tags: 1 });
animationPresetSchema.index({ isActive: 1 });
animationPresetSchema.index({ isPublic: 1 });
animationPresetSchema.index({ usageCount: -1 });
animationPresetSchema.index({ createdAt: -1 });

// Compound indexes
animationPresetSchema.index({ category: 1, isActive: 1, isPublic: 1 });
animationPresetSchema.index({ tags: 1, isActive: 1, isPublic: 1 });

// Methods
animationPresetSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

animationPresetSchema.methods.getFramerMotionConfig = function(element = 'title') {
  const config = this.animationConfig[element];
  if (!config) return null;
  
  const motionConfig = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: config.duration,
      delay: config.delay,
      ease: config.customCurve || config.easing
    }
  };
  
  // Add specific animation properties based on type
  switch (config.type) {
    case 'slideUp':
      motionConfig.initial.y = config.distance;
      motionConfig.animate.y = 0;
      break;
    case 'slideDown':
      motionConfig.initial.y = -config.distance;
      motionConfig.animate.y = 0;
      break;
    case 'slideLeft':
      motionConfig.initial.x = config.distance;
      motionConfig.animate.x = 0;
      break;
    case 'slideRight':
      motionConfig.initial.x = -config.distance;
      motionConfig.animate.x = 0;
      break;
    case 'zoomIn':
      motionConfig.initial.scale = config.scale;
      motionConfig.animate.scale = 1;
      break;
    case 'zoomOut':
      motionConfig.initial.scale = 1 / config.scale;
      motionConfig.animate.scale = 1;
      break;
    case 'rotateIn':
      motionConfig.initial.rotate = config.rotation;
      motionConfig.animate.rotate = 0;
      break;
  }
  
  return motionConfig;
};

module.exports = mongoose.model('AnimationPreset', animationPresetSchema);