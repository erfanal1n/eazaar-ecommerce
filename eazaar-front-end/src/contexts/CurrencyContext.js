'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetDefaultCurrencyQuery } from '@/redux/features/currencyApi';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    data: defaultCurrencyData, 
    isLoading: isDefaultLoading,
    error: defaultCurrencyError 
  } = useGetDefaultCurrencyQuery();

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      try {
        const parsedCurrency = JSON.parse(savedCurrency);
        setCurrentCurrency(parsedCurrency);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing saved currency:', error);
        localStorage.removeItem('selectedCurrency');
      }
    }

    // If no saved currency, use default from API
    if (defaultCurrencyData?.success && defaultCurrencyData?.data) {
      setCurrentCurrency(defaultCurrencyData.data);
      setIsLoading(false);
    } else if (defaultCurrencyError) {
      // Fallback to USD if API fails
      const fallbackCurrency = {
        name: 'US Dollar',
        code: 'USD',
        symbol: '$',
        position: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        isActive: true,
        isDefault: true,
        exchangeRate: 1,
        locale: 'en-US'
      };
      setCurrentCurrency(fallbackCurrency);
      setIsLoading(false);
      console.warn('Failed to load default currency, using USD fallback:', defaultCurrencyError);
    }
  }, [defaultCurrencyData, defaultCurrencyError]);

  // Custom setCurrentCurrency that also saves to localStorage
  const handleSetCurrentCurrency = (currency) => {
    setCurrentCurrency(currency);
    if (currency) {
      localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    }
  };

  const formatPrice = (amount, currency = currentCurrency) => {
    if (!currency || typeof amount !== 'number') {
      return `$${amount}`;
    }

    try {
      // Convert amount with exchange rate
      const convertedAmount = amount * (currency.exchangeRate || 1);
      
      // Format with specified decimals and separators
      const parts = convertedAmount.toFixed(currency.decimals || 2).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator || ',');
      
      let formattedAmount = parts.join(currency.decimalSeparator || '.');
      
      // Add currency symbol based on position
      if (currency.position === 'after') {
        return `${formattedAmount}${currency.symbol}`;
      } else {
        return `${currency.symbol}${formattedAmount}`;
      }
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${currency.symbol || '$'}${amount}`;
    }
  };

  const formatPriceSimple = (amount, currency = currentCurrency) => {
    if (!currency || typeof amount !== 'number') {
      return `$${amount}`;
    }

    try {
      // Simple formatting without thousands separators for inline display
      const convertedAmount = amount * (currency.exchangeRate || 1);
      const formattedAmount = convertedAmount.toFixed(currency.decimals || 2);
      
      if (currency.position === 'after') {
        return `${formattedAmount}${currency.symbol}`;
      } else {
        return `${currency.symbol}${formattedAmount}`;
      }
    } catch (error) {
      console.error('Error formatting price simple:', error);
      return `${currency.symbol || '$'}${amount}`;
    }
  };

  const getCurrencySymbol = (currency = currentCurrency) => {
    return currency?.symbol || '$';
  };

  const value = {
    currentCurrency,
    isLoading: isLoading || isDefaultLoading,
    formatPrice,
    formatPriceSimple,
    getCurrencySymbol,
    setCurrentCurrency: handleSetCurrentCurrency, // Updated to use localStorage handler
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};