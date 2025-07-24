'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// internal
import offer_img from '@assets/img/banner/banner-slider-offer.png';
import banner_img_1 from '@assets/img/banner/banner-slider-1.png';
import banner_img_2 from '@assets/img/banner/banner-slider-2.png';
import banner_img_3 from '@assets/img/banner/banner-slider-3.png';
import { useGetBannersByPositionQuery } from '@/redux/features/bannerApi';

// fallback banner products (original hardcoded data)
const fallbackBannerProducts = [
  {
    id: 1,
    banner_bg_txt: 'tablet',
    subtitle: 'Tablet Collection 2023',
    title: 'Galaxy Tab S6 Lite Android Tablet',
    oldPrice: 320,
    newPrice: 288,
    img: banner_img_1,
  },
  {
    id: 2,
    banner_bg_txt: 'tablet',
    subtitle: 'Tablet Collection 2023',
    title: 'Galaxy Tab S6 Lite Android Tablet',
    oldPrice: 320,
    newPrice: 288,
    img: banner_img_2,
  },
  {
    id: 3,
    banner_bg_txt: 'tablet',
    subtitle: 'Tablet Collection 2023',
    title: 'Galaxy Tab S6 Lite Android Tablet',
    oldPrice: 320,
    newPrice: 288,
    img: banner_img_3,
  },
]

// slider setting 
const slider_setting = {
  slidesPerView: 1,
  spaceBetween: 0,
  effect: 'fade',
  pagination: {
    el: ".tp-product-banner-slider-dot",
    clickable: true,
  }
}

const ProductBanner = () => {
  // Fetch banner data from database
  const {
    data: bannerData,
    error,
    isLoading
  } = useGetBannersByPositionQuery('product-banner');

  // Determine which banners to use
  const getBannerProducts = () => {
    if (isLoading || error || !bannerData?.banners || bannerData.banners.length === 0) {
      return fallbackBannerProducts;
    }

    // Transform database banners to match original format
    return bannerData.banners.map((banner, index) => ({
      id: banner._id || index + 1,
      banner_bg_txt: banner.content?.bgText || fallbackBannerProducts[index % 3]?.banner_bg_txt || 'tablet',
      subtitle: banner.content?.subtitle || fallbackBannerProducts[index % 3]?.subtitle,
      title: banner.content?.title || fallbackBannerProducts[index % 3]?.title,
      oldPrice: banner.content?.oldPrice || fallbackBannerProducts[index % 3]?.oldPrice || 320,
      newPrice: banner.content?.newPrice || banner.content?.price || fallbackBannerProducts[index % 3]?.newPrice || 288,
      img: banner.media?.url ? { src: banner.media.url } : fallbackBannerProducts[index % 3]?.img,
      link: banner.link?.url || '/shop'
    }));
  };

  const bannerProducts = getBannerProducts();

  return (
    <>
      <div className="tp-product-banner-area pb-90">
        <div className="container">
          <div className="tp-product-banner-slider fix">
            <Swiper {...slider_setting} modules={[Pagination, EffectFade]} className="tp-product-banner-slider-active swiper-container">
              {bannerProducts.map((item, i) => (
                <SwiperSlide key={item.id} className="tp-product-banner-inner theme-bg p-relative z-index-1 fix">
                  <h4 className="tp-product-banner-bg-text">{item.banner_bg_txt}</h4>
                  <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-6">
                      <div className="tp-product-banner-content p-relative z-index-1">
                        <span className="tp-product-banner-subtitle">{item.subtitle}</span>
                        <h3 className="tp-product-banner-title">{item.title}</h3>
                        <div className="tp-product-banner-price mb-40">
                          <span className="old-price">${item.oldPrice.toFixed(2)}</span>
                          <p className="new-price">${item.newPrice.toFixed(2)}</p>
                        </div>
                        <div className="tp-product-banner-btn">
                          <Link href={item.link || "/shop"} className="tp-btn tp-btn-2">Shop now</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <div className="tp-product-banner-thumb-wrapper p-relative">
                        <div className="tp-product-banner-thumb-shape">
                          <span className="tp-product-banner-thumb-gradient"></span>
                          <Image className="tp-offer-shape" src={offer_img} alt="tp-offer-shape" />
                        </div>

                        <div className="tp-product-banner-thumb text-end p-relative z-index-1">
                          {item.img?.src ? (
                            <Image 
                              src={item.img.src} 
                              alt={item.title || "banner-slider img"} 
                              width={400}
                              height={300}
                              priority={true}
                            />
                          ) : (
                            <Image src={item.img} alt="banner-slider img" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="tp-product-banner-slider-dot tp-swiper-dot"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBanner;