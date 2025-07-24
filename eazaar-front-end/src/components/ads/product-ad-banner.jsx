'use client';
import React from 'react';
import Link from 'next/link';

const ProductAdBanner = ({ 
  title = "AI CODING ASSISTANT", 
  subtitle = "Try the AI that tames the complexity of evolving your most sophisticated codebases",
  buttonText = "Get Started",
  buttonLink = "#",
  backgroundColor = "#000000",
  textColor = "#ffffff"
}) => {
  return (
    <div className="tp-product-ad-banner">
      <div 
        className="tp-product-ad-banner-content"
        style={{ 
          backgroundColor: backgroundColor,
          color: textColor 
        }}
      >
        <div className="tp-product-ad-banner-text">
          <h3 className="tp-product-ad-banner-title">{title}</h3>
          <p className="tp-product-ad-banner-description">{subtitle}</p>
        </div>
        
        <div className="tp-product-ad-banner-icon">
          <div className="tp-product-ad-banner-code-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="32" height="24" rx="2" stroke={textColor} strokeWidth="2"/>
              <path d="M12 16L16 20L12 24" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 24H28" stroke={textColor} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        
        <div className="tp-product-ad-banner-action">
          <Link href={buttonLink} className="tp-product-ad-banner-btn">
            <span>{buttonText}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill={textColor}/>
              <path d="M8 10L12 10M12 10L10 8M12 10L10 12" stroke={backgroundColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductAdBanner;