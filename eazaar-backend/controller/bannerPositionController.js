const BannerPosition = require('../model/BannerPosition');
const Banner = require('../model/Banner');

const getAllPositions = async (req, res) => {
  try {
    const positions = await BannerPosition.find()
      .populate('slides')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: positions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPositionByName = async (req, res) => {
  try {
    const { name } = req.params;
    const position = await BannerPosition.findOne({ name })
      .populate('slides');
    
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updatePositionSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { slideSettings } = req.body;
    
    const position = await BannerPosition.findByIdAndUpdate(
      id,
      { slideSettings },
      { new: true, runValidators: true }
    );
    
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addSlideToPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerData = req.body;
    
    const position = await BannerPosition.findById(id);
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }
    
    const banner = new Banner({
      ...bannerData,
      positionId: id
    });
    
    await banner.save();
    
    position.slides.push(banner._id);
    await position.save();
    
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const removeSlideFromPosition = async (req, res) => {
  try {
    const { id, slideId } = req.params;
    
    const position = await BannerPosition.findById(id);
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }
    
    await Banner.findByIdAndDelete(slideId);
    
    position.slides = position.slides.filter(
      slide => slide.toString() !== slideId
    );
    await position.save();
    
    res.status(200).json({
      success: true,
      message: 'Slide removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const reorderSlides = async (req, res) => {
  try {
    const { id } = req.params;
    const { slideIds } = req.body;
    
    const position = await BannerPosition.findById(id);
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }
    
    position.slides = slideIds;
    await position.save();
    
    await Promise.all(
      slideIds.map((slideId, index) => 
        Banner.findByIdAndUpdate(slideId, { displayOrder: index })
      )
    );
    
    res.status(200).json({
      success: true,
      message: 'Slides reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllPositions,
  getPositionByName,
  updatePositionSettings,
  addSlideToPosition,
  removeSlideFromPosition,
  reorderSlides
};