'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Link from "next/link";
// internal
import ProductItem from "./product-item";
import { useGetOfferProductsQuery } from "@/redux/features/productApi";
import { ArrowRightLong, ShapeLine } from "@/svg";
import HomeOfferPrdLoader from "@/components/loader/home/home-offer-prd-loader";

// slider setting
const sliderSetting = {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: ".tp-deals-slider-dot",
    clickable: true,
  },
  breakpoints: {
    1200: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 1,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

const OfferProducts = () => {
  const {data: products,isError,isLoading} = useGetOfferProductsQuery("electronics");
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeOfferPrdLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = (
      <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "200px" }}>
        <div className="text-center">
          <i className="fa-regular fa-exclamation-triangle" style={{ fontSize: "48px", color: "#ef4444", marginBottom: "16px" }}></i>
          <h5 style={{ color: "#ef4444", marginBottom: "8px" }}>Error Loading Deals</h5>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = (
      <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "200px" }}>
        <div className="text-center">
          <i className="fa-regular fa-box-open" style={{ fontSize: "48px", color: "#6b7280", marginBottom: "16px" }}></i>
          <h5 style={{ color: "#6b7280", marginBottom: "8px" }}>No Deals Available</h5>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Check back later for exciting deals!</p>
        </div>
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;
    content = (
      <Swiper
        {...sliderSetting}
        modules={[Pagination]}
        className="tp-product-offer-slider-active swiper-container"
      >
        {product_items.map((item, i) => (
          <SwiperSlide key={i}>
            <ProductItem product={item} offer_style={true} />
          </SwiperSlide>
        ))}

        <div className="tp-deals-slider-dot tp-swiper-dot text-center mt-40"></div>
      </Swiper>
    );
  }

  return (
    <>
      <section className="tp-product-offer grey-bg-2 pt-70 pb-80">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xl-4 col-md-5 col-sm-6">
              <div className="tp-section-title-wrapper mb-40">
                <h3 className="tp-section-title">
                  Deal of The Day
                  <ShapeLine />
                </h3>
              </div>
            </div>
            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="tp-product-offer-more-wrapper d-flex justify-content-sm-end p-relative z-index-1">
                <div className="tp-product-offer-more mb-40 text-sm-end grey-bg-2">
                  <Link href="/shop" className="tp-btn tp-btn-2 tp-btn-blue">
                    View All Deals
                    <ArrowRightLong />
                  </Link>
                  <span className="tp-product-offer-more-border"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-product-offer-slider fix">{content}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OfferProducts;
