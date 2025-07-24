'use client'
import React from 'react';
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

// stripePromise - with error handling
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY && process.env.NEXT_PUBLIC_STRIPE_KEY.startsWith('pk_') 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : Promise.resolve(null);

const Providers = ({ children }) => {
  const isStripeEnabled = process.env.NEXT_PUBLIC_STRIPE_KEY && process.env.NEXT_PUBLIC_STRIPE_KEY.startsWith('pk_');
  
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <CurrencyProvider>
            {isStripeEnabled ? (
              <Elements stripe={stripePromise}>
                {children}
              </Elements>
            ) : (
              children
            )}
          </CurrencyProvider>
        </Provider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default Providers;