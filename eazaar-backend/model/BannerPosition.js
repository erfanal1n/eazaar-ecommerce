const mongoose = require('mongoose');

const bannerPositionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['slider', 'single']
  },
  theme: {
    type: String,
    required: true,
    enum: ['electronics', 'beauty', 'fashion', 'jewelry', 'all']
  },
  slideSettings: {
    autoPlay: {
      type: Boolean,
      default: true
    },
    autoPlaySpeed: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    },
    pauseOnHover: {
      type: Boolean,
      default: true
    },
    infiniteLoop: {
      type: Boolean,
      default: true
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    showDots: {
      type: Boolean,
      default: true
    },
    showCounter: {
      type: Boolean,
      default: false
    },
    transitionType: {
      type: String,
      enum: ['fade', 'slide', 'zoom'],
      default: 'slide'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  slides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Banner'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('BannerPosition', bannerPositionSchema);