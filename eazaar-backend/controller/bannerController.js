const Banner = require('../model/Banner');
const BannerPosition = require('../model/BannerPosition');

const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id).populate('positionId');
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }
    
    res.status(200).json({
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

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const banner = await Banner.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }
    
    res.status(200).json({
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

const bulkUpdateStatus = async (req, res) => {
  try {
    const { bannerIds, isActive } = req.body;
    
    await Banner.updateMany(
      { _id: { $in: bannerIds } },
      { isActive }
    );
    
    res.status(200).json({
      success: true,
      message: `${bannerIds.length} banners updated successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const bulkUpdateStyle = async (req, res) => {
  try {
    const { bannerIds, layout } = req.body;
    
    await Banner.updateMany(
      { _id: { $in: bannerIds } },
      { 
        'layout.backgroundColor': layout.backgroundColor,
        'layout.textColor': layout.textColor
      }
    );
    
    res.status(200).json({
      success: true,
      message: `${bannerIds.length} banners updated successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const bulkUpdateAnimation = async (req, res) => {
  try {
    const { bannerIds, animation } = req.body;
    
    await Banner.updateMany(
      { _id: { $in: bannerIds } },
      { animation }
    );
    
    res.status(200).json({
      success: true,
      message: `${bannerIds.length} banners updated successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getBannerById,
  updateBanner,
  bulkUpdateStatus,
  bulkUpdateStyle,
  bulkUpdateAnimation
};