// ===== SIMPLIFIED SCENARIO SYSTEM HELPERS =====
// All banners now use custom scenario with optional features

// Main function to process banner data - simplified for custom-only approach
const generateScenarioContent = (bannerData) => {
  const { scenario } = bannerData;
  
  // All banners are now custom type - process all enabled features
  let processedContent = { ...bannerData };
  
  // Process countdown timer if enabled
  if (scenario?.discountData?.enableCountdown) {
    processedContent = processCountdownFeatures(processedContent);
  }
  
  // Process product badges if enabled
  if (scenario?.newProductData?.enabled) {
    processedContent = processProductBadges(processedContent);
  }
  
  // Process social media links if enabled
  if (scenario?.advertisementData?.enabled) {
    processedContent = processSocialMediaFeatures(processedContent);
  }
  
  return processedContent;
};

// Process countdown timer features
const processCountdownFeatures = (bannerData) => {
  const { scenario } = bannerData;
  const discountData = scenario.discountData;
  
  let content = { ...bannerData };
  
  // Ensure countdown visibility is enabled
  if (discountData?.enableCountdown) {
    content.visibility = {
      ...content.visibility,
      countdown: true
    };
    
    // Enable countdown in interactive elements
    content.interactiveElements = {
      ...content.interactiveElements,
      countdownTimer: {
        ...content.interactiveElements?.countdownTimer,
        enabled: true,
        endDate: discountData.endDateTime,
        format: 'days-hours-minutes'
      }
    };
  }
  
  return content;
};

// Process product badges and features
const processProductBadges = (bannerData) => {
  const { scenario } = bannerData;
  const newProductData = scenario.newProductData;
  
  let content = { ...bannerData };
  
  // Ensure badges are visible if any are enabled
  if (newProductData?.badges?.newBadge?.enabled || newProductData?.badges?.limitedEdition?.enabled) {
    content.visibility = {
      ...content.visibility,
      productBadges: true
    };
  }
  
  // Process key features if provided
  if (newProductData?.keyFeatures) {
    content.productFeatures = {
      enabled: true,
      features: typeof newProductData.keyFeatures === 'string' 
        ? newProductData.keyFeatures.split(',').map(f => f.trim()).filter(f => f)
        : []
    };
  }
  
  return content;
};

// Process social media and external links
const processSocialMediaFeatures = (bannerData) => {
  const { scenario } = bannerData;
  const adData = scenario.advertisementData;
  
  let content = { ...bannerData };
  
  // Enable social media in interactive elements if links are provided
  const socialLinks = adData?.externalLinks?.socialMedia;
  const hasLinks = socialLinks && Object.values(socialLinks).some(link => link && link.trim());
  
  if (hasLinks || adData?.externalLinks?.website) {
    content.interactiveElements = {
      ...content.interactiveElements,
      socialMedia: {
        enabled: true,
        links: {
          website: adData.externalLinks?.website,
          ...socialLinks
        },
        position: 'bottom-right'
      }
    };
    
    content.visibility = {
      ...content.visibility,
      socialLinks: true
    };
  }
  
  return content;
};

// Legacy validation function - kept for backward compatibility
const validateScenarioData = (bannerData) => {
  // All scenarios are now custom, so just return true
  return { isValid: true, errors: [] };
};

// Legacy defaults function - kept for backward compatibility
const applyScenarioDefaults = (bannerData) => {
  // Ensure scenario type is always custom
  const processedBanner = {
    ...bannerData,
    scenario: {
      ...bannerData.scenario,
      type: 'custom'
    }
  };
  
  return processedBanner;
};

module.exports = {
  generateScenarioContent,
  validateScenarioData,
  applyScenarioDefaults,
  processCountdownFeatures,
  processProductBadges,
  processSocialMediaFeatures
};