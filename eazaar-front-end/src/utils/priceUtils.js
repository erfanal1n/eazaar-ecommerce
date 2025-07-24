/**
 * Utility functions for consistent price formatting
 */

/**
 * Formats a price value ensuring no double dollar signs
 * @param {number|string} price - The price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  // Handle null/undefined
  if (price == null) return `${currency}0.00`;
  
  // Convert to string to check if it already has currency
  const priceStr = String(price);
  
  // If price already contains currency symbol, return as-is
  if (priceStr.includes(currency)) {
    return priceStr;
  }
  
  // Convert to number and format
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return `${currency}0.00`;
  }
  
  return `${currency}${numericPrice.toFixed(2)}`;
};

/**
 * Formats price for display in hero sliders with conditional currency
 * @param {number|string} price - The price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price string
 */
export const formatHeroPrice = (price, currency = '$') => {
  if (typeof price === 'number') {
    return `${currency}${price}`;
  }
  return price;
};

/**
 * Calculates and formats discounted price
 * @param {number} originalPrice - Original price
 * @param {number} discount - Discount percentage (0-100)
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted discounted price
 */
export const formatDiscountedPrice = (originalPrice, discount, currency = '$') => {
  const discountedPrice = originalPrice - (originalPrice * discount) / 100;
  return formatPrice(discountedPrice, currency);
};

/**
 * Formats price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice, currency = '$') => {
  return `${currency}${minPrice} - ${currency}${maxPrice}`;
};