const express = require('express');
const router = express.Router();
const {
  getAllPositions,
  getPositionByName,
  updatePositionSettings,
  addSlideToPosition,
  removeSlideFromPosition,
  reorderSlides
} = require('../controller/bannerPositionController');

router.get('/', getAllPositions);
router.get('/:name', getPositionByName);
router.put('/:id/settings', updatePositionSettings);
router.post('/:id/slides', addSlideToPosition);
router.delete('/:id/slides/:slideId', removeSlideFromPosition);
router.patch('/:id/slides/reorder', reorderSlides);

module.exports = router;