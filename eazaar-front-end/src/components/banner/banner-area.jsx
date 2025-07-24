'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
// internal
import { ArrowRight } from "@/svg";
import banner_1 from "@assets/img/product/banner/product-banner-1.jpg";
import banner_2 from "@assets/img/product/banner/product-banner-2.jpg";
import { useGetBannersByPositionQuery } from "@/redux/features/bannerApi";


// banner item
function BannerItem({ sm = false, bg, title, subtitle, description, link, linkText }) {
  const bgImage = bg?.src || bg;
  const href = link || "/shop";
  const buttonText = linkText || "Shop Now";

  return (
    <div
      className={`tp-banner-item ${
        sm ? "tp-banner-item-sm" : ""
      } tp-banner-height p-relative mb-30 z-index-1 fix`}
    >
      <div
        className="tp-banner-thumb include-bg transition-3"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="tp-banner-content">
        {!sm && subtitle && <span>{subtitle}</span>}
        <h3 className="tp-banner-title">
          <Link href={href}>{title}</Link>
        </h3>
        {sm && description && <p>{description}</p>}
        <div className="tp-banner-btn">
          <Link href={href} className="tp-link-btn">
            {buttonText}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

const BannerArea = () => {
  // Fetch banner data from database
  const {
    data: bannerData,
    error,
    isLoading
  } = useGetBannersByPositionQuery('product-banner');

  // Fallback data (original hardcoded banners)
  const fallbackBanners = [
    {
      id: 1,
      bg: banner_1,
      title: <>Smartphone <br /> BLU G91 Pro 2022</>,
      subtitle: "Sale 20% off all store",
      sm: false
    },
    {
      id: 2,
      bg: banner_2,
      title: <>HyperX Cloud II <br /> Wireless</>,
      description: "Sale 35% off",
      sm: true
    }
  ];

  // Determine which banners to use
  const getBanners = () => {
    if (isLoading || error || !bannerData?.banners || bannerData.banners.length === 0) {
      return fallbackBanners;
    }

    // Transform database banners to match original format
    return bannerData.banners.map((banner, index) => ({
      id: banner._id || index + 1,
      bg: banner.media?.url || fallbackBanners[index % 2]?.bg,
      title: banner.content?.title || fallbackBanners[index % 2]?.title,
      subtitle: banner.content?.subtitle || fallbackBanners[index % 2]?.subtitle,
      description: banner.content?.description || fallbackBanners[index % 2]?.description,
      link: banner.link?.url || "/shop",
      linkText: banner.link?.text || "Shop Now",
      sm: index > 0 // First banner is large, rest are small
    }));
  };

  const banners = getBanners();

  return (
    <section className="tp-banner-area pb-70">
      <div className="container">
        <div className="row">
          {banners.map((banner, index) => (
            <div 
              key={banner.id} 
              className={index === 0 ? "col-xl-8 col-lg-7" : "col-xl-4 col-lg-5"}
            >
              <BannerItem
                bg={banner.bg}
                title={banner.title}
                subtitle={banner.subtitle}
                description={banner.description}
                link={banner.link}
                linkText={banner.linkText}
                sm={banner.sm}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerArea;
