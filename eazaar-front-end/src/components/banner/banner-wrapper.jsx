'use client';
import React from 'react';
import { useGetBannersByPositionQuery } from '@/redux/features/bannerApi';
import DynamicBanner from './dynamic-banner';

// Banner loading skeleton
const BannerSkeleton = ({ className = '' }) => (
  <div className={`tp-banner-skeleton ${className}`}>
    <div className="tp-skeleton-content">
      <div className="tp-skeleton-line tp-skeleton-title"></div>
      <div className="tp-skeleton-line tp-skeleton-subtitle"></div>
      <div className="tp-skeleton-line tp-skeleton-description"></div>
      <div className="tp-skeleton-button"></div>
    </div>
  </div>
);

// Banner error fallback
const BannerError = ({ error, positionKey, className = '' }) => {
  console.error(`Banner error for position ${positionKey}:`, error);
  return (
    <div className={`tp-banner-error ${className}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tp-banner-error-content text-center py-5">
              <p className="text-muted">Unable to load banner content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerWrapper = ({ 
  positionKey, 
  className = '', 
  fallbackComponent: FallbackComponent = null,
  showSkeleton = true 
}) => {
  const {
    data: bannerData,
    error,
    isLoading,
    isError
  } = useGetBannersByPositionQuery(positionKey, {
    skip: !positionKey,
  });

  // Loading state
  if (isLoading && showSkeleton) {
    return <BannerSkeleton className={className} />;
  }

  // Error state - show fallback component if provided
  if (isError || !bannerData) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return <BannerError error={error} positionKey={positionKey} className={className} />;
  }

  // No banners found - show fallback if provided
  if (!bannerData.banners || bannerData.banners.length === 0) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return null;
  }

  // Render dynamic banner
  return (
    <DynamicBanner 
      bannerData={bannerData}
      className={className}
    />
  );
};

export default BannerWrapper;