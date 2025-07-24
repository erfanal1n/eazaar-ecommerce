/**
 * Utility functions for responsive design
 */
import { useState, useEffect } from 'react';

/**
 * Gets the appropriate font size based on screen size
 * @param {Object} fontSizes - Object with desktop, tablet, mobile font sizes
 * @param {string} device - Current device type ('desktop', 'tablet', 'mobile')
 * @returns {number} Font size for the device
 */
export const getResponsiveFontSize = (fontSizes, device = 'desktop') => {
  if (!fontSizes || typeof fontSizes !== 'object') {
    return 16; // Default font size
  }
  
  const size = fontSizes[device] || fontSizes.desktop || 16;
  return typeof size === 'number' ? size : parseInt(size) || 16;
};

/**
 * Gets device type based on window width
 * @returns {string} Device type ('desktop', 'tablet', 'mobile')
 */
export const getDeviceType = () => {
  if (typeof window === 'undefined') {
    return 'desktop'; // Default for SSR
  }
  
  const width = window.innerWidth;
  
  if (width >= 1024) {
    return 'desktop';
  } else if (width >= 768) {
    return 'tablet';
  } else {
    return 'mobile';
  }
};

/**
 * Hook to get current device type with responsive updates
 */
export const useDeviceType = () => {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  
  const [deviceType, setDeviceType] = useState(getDeviceType());
  
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return deviceType;
};

/**
 * Creates responsive CSS media queries for typography
 * @param {Object} typography - Typography object with responsive font sizes
 * @returns {Object} CSS styles object with media queries
 */
export const createResponsiveTypographyStyles = (typography) => {
  if (!typography) return {};
  
  const baseStyles = {
    color: typography.color ? `${typography.color} !important` : undefined, // Add !important only if color exists
    fontFamily: typography.fontFamily ? `${typography.fontFamily} !important` : undefined,
    fontWeight: typography.fontWeight ? `${typography.fontWeight} !important` : undefined,
    lineHeight: typography.lineHeight,
    textAlign: typography.textAlign,
    textTransform: typography.textTransform,
    letterSpacing: typography.letterSpacing ? `${typography.letterSpacing}px` : undefined,
    fontSize: `${typography.fontSize?.desktop || 16}px`
  };
  
  // Remove undefined values
  Object.keys(baseStyles).forEach(key => {
    if (baseStyles[key] === undefined) {
      delete baseStyles[key];
    }
  });
  
  // Debug log for color application
  if (typography.color) {
    console.log('🎨 ResponsiveUtils - Applying color:', typography.color);
    console.log('🎨 ResponsiveUtils - Generated baseStyles:', baseStyles);
    console.log('🎨 ResponsiveUtils - Final color value:', baseStyles.color);
  }
  
  return baseStyles;
};