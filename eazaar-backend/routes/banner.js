const express = require('express');
const router = express.Router();
const {
  getBannerById,
  updateBanner,
  bulkUpdateStatus,
  bulkUpdateStyle,
  bulkUpdateAnimation
} = require('../controller/bannerController');

router.get('/:id', getBannerById);
router.put('/:id', updateBanner);
router.patch('/bulk/status', bulkUpdateStatus);
router.patch('/bulk/style', bulkUpdateStyle);
router.patch('/bulk/animation', bulkUpdateAnimation);

module.exports = router;