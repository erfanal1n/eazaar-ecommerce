'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Pagination, Autoplay } from 'swiper/modules';
// internal
import { ArrowNext, ArrowPrev, Play, Pause } from '@/svg';

const DynamicBanner = ({ bannerData, className = '' }) => {
  const { position, banners } = bannerData;

  // No banners available
  if (!banners || banners.length === 0) {
    return null;
  }

  // Single banner (static)
  if (banners.length === 1) {
    return <SingleBanner banner={banners[0]} position={position} className={className} />;
  }

  // Multiple banners (slider)
  return <MultiBanner banners={banners} position={position} className={className} />;
};

// Single Banner Component
const SingleBanner = ({ banner, position, className }) => {
  const getResponsiveImage = (media, device = 'desktop') => {
    if (!media || !media.responsive) return media?.url || '';
    
    switch (device) {
      case 'mobile':
        return media.responsive.mobile || media.responsive.tablet || media.responsive.desktop || media.url;
      case 'tablet':
        return media.responsive.tablet || media.responsive.desktop || media.url;
      default:
        return media.responsive.desktop || media.url;
    }
  };

  const renderContent = () => (
    <div className="tp-banner-content" style={{
      textAlign: banner.layout?.contentPosition?.horizontal || 'left',
      alignSelf: banner.layout?.contentPosition?.vertical || 'center'
    }}>
      {banner.content?.subtitle && (
        <span className="tp-banner-subtitle">{banner.content.subtitle}</span>
      )}
      {banner.content?.title && (
        <h3 className="tp-banner-title">{banner.content.title}</h3>
      )}
      {banner.content?.description && (
        <p className="tp-banner-description">{banner.content.description}</p>
      )}
      {banner.link?.enabled && banner.link?.url && (
        <div className="tp-banner-btn">
          <Link 
            href={banner.link.url}
            className={`tp-btn ${banner.link.style || 'tp-btn-border'}`}
            target={banner.link.openInNewTab ? '_blank' : '_self'}
          >
            {banner.link.text || 'Learn More'}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <section className={`tp-banner-area ${className}`}>
      <div className={position.settings?.containerType === 'fluid' ? 'container-fluid' : 'container'}>
        <div className="tp-banner-item tp-banner-height p-relative mb-30 z-index-1 fix">
          {/* Background Media */}
          {banner.media?.type === 'image' && (
            <div className="tp-banner-thumb include-bg transition-3">
              <picture>
                <source 
                  media="(max-width: 768px)" 
                  srcSet={getResponsiveImage(banner.media, 'mobile')} 
                />
                <source 
                  media="(max-width: 1024px)" 
                  srcSet={getResponsiveImage(banner.media, 'tablet')} 
                />
                <Image
                  src={getResponsiveImage(banner.media, 'desktop')}
                  alt={banner.content?.title || 'Banner'}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={position.key === 'hero-slider'}
                />
              </picture>
            </div>
          )}
          
          {banner.media?.type === 'video' && (
            <div className="tp-banner-video">
              <video
                autoPlay={banner.media.autoplay}
                muted={banner.media.muted}
                loop={banner.media.loop}
                controls={banner.media.controls}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src={banner.media.url} type="video/mp4" />
              </video>
            </div>
          )}

          {/* Content Overlay */}
          <div className="tp-banner-content-wrapper d-flex align-items-center">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-6 col-lg-6 col-md-8">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Multi Banner Component (Slider)
const MultiBanner = ({ banners, position, className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider settings based on position configuration
  const sliderSettings = {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: banners.length > 1,
    effect: position.settings?.transition || 'slide',
    autoplay: position.settings?.autoplay ? {
      delay: (position.settings?.timing || 5) * 1000,
      disableOnInteraction: false,
    } : false,
    navigation: {
      nextEl: `.tp-slider-${position.key}-button-next`,
      prevEl: `.tp-slider-${position.key}-button-prev`,
    },
    pagination: {
      el: `.tp-slider-${position.key}-dot`,
      clickable: true,
    },
    onSlideChange: (swiper) => setCurrentSlide(swiper.activeIndex),
  };

  const getResponsiveImage = (media, device = 'desktop') => {
    if (!media || !media.responsive) return media?.url || '';
    
    switch (device) {
      case 'mobile':
        return media.responsive.mobile || media.responsive.tablet || media.responsive.desktop || media.url;
      case 'tablet':
        return media.responsive.tablet || media.responsive.desktop || media.url;
      default:
        return media.responsive.desktop || media.url;
    }
  };

  return (
    <section className={`tp-slider-area p-relative z-index-1 ${className}`}>
      <Swiper
        {...sliderSettings}
        modules={[Navigation, EffectFade, Pagination, Autoplay]}
        className={`tp-slider-active-${position.key} swiper-container`}
      >
        {banners.map((banner, index) => (
          <SwiperSlide
            key={banner._id}
            className={`tp-slider-item tp-slider-height p-relative d-flex align-items-center ${
              banner.layout?.theme || ''
            }`}
          >
            {/* Background Media */}
            {banner.media?.type === 'image' && (
              <div className="tp-slider-thumb include-bg">
                <picture>
                  <source 
                    media="(max-width: 768px)" 
                    srcSet={getResponsiveImage(banner.media, 'mobile')} 
                  />
                  <source 
                    media="(max-width: 1024px)" 
                    srcSet={getResponsiveImage(banner.media, 'tablet')} 
                  />
                  <Image
                    src={getResponsiveImage(banner.media, 'desktop')}
                    alt={banner.content?.title || 'Banner'}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                  />
                </picture>
              </div>
            )}

            {banner.media?.type === 'video' && (
              <div className="tp-slider-video">
                <video
                  autoPlay={banner.media.autoplay}
                  muted={banner.media.muted}
                  loop={banner.media.loop}
                  controls={banner.media.controls}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src={banner.media.url} type="video/mp4" />
                </video>
              </div>
            )}

            {/* Content */}
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-6 col-lg-6 col-md-8">
                  <div className="tp-slider-content" style={{
                    textAlign: banner.layout?.contentPosition?.horizontal || 'left'
                  }}>
                    {banner.content?.subtitle && (
                      <span className="tp-slider-subtitle">{banner.content.subtitle}</span>
                    )}
                    {banner.content?.title && (
                      <h3 className="tp-slider-title">{banner.content.title}</h3>
                    )}
                    {banner.content?.description && (
                      <p className="tp-slider-description">{banner.content.description}</p>
                    )}
                    {banner.link?.enabled && banner.link?.url && (
                      <div className="tp-slider-btn">
                        <Link 
                          href={banner.link.url}
                          className={`tp-btn ${banner.link.style || 'tp-btn-border'}`}
                          target={banner.link.openInNewTab ? '_blank' : '_self'}
                        >
                          {banner.link.text || 'Learn More'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation */}
        {position.settings?.showNavigation && (
          <div className={`tp-slider-arrow tp-slider-arrow-${position.key}`}>
            <button type="button" className={`tp-slider-${position.key}-button-prev`}>
              <ArrowPrev />
            </button>
            <button type="button" className={`tp-slider-${position.key}-button-next`}>
              <ArrowNext />
            </button>
          </div>
        )}

        {/* Pagination */}
        {position.settings?.showPagination && (
          <div className={`tp-swiper-dot tp-slider-${position.key}-dot`}></div>
        )}
      </Swiper>
    </section>
  );
};

export default DynamicBanner;