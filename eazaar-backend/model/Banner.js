const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  media: {
    desktop: {
      url: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      }
    },
    tablet: {
      url: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      }
    },
    mobile: {
      url: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      }
    },
    alt: {
      type: String,
      required: true
    }
  },
  videoSettings: {
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: true
    }
  },
  link: {
    url: {
      type: String
    },
    text: {
      type: String,
      default: 'Shop Now'
    },
    openInNewTab: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  layout: {
    textAlign: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left'
    },
    contentPosition: {
      type: String,
      enum: ['top', 'center', 'bottom'],
      default: 'center'
    },
    overlayOpacity: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.3
    },
    backgroundColor: {
      type: String,
      default: '#000000'
    },
    textColor: {
      type: String,
      default: '#ffffff'
    }
  },
  animation: {
    type: {
      type: String,
      enum: ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'zoomIn', 'bounceIn', 'none'],
      default: 'fadeIn'
    },
    duration: {
      type: Number,
      min: 0.3,
      max: 2,
      default: 1
    },
    delay: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BannerPosition',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);