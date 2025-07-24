// Utility functions for handling address formatting in frontend

export const formatAddressToString = (address) => {
  if (!address) return '';
  
  if (typeof address === 'string') {
    return address;
  }
  
  if (typeof address === 'object' && address !== null) {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  }
  
  return '';
};

export const parseStringToAddress = (addressString) => {
  // For now, we'll keep it as a string since the backend expects string format
  // In the future, this could parse the string into an address object
  return addressString ? addressString.trim() : '';
};