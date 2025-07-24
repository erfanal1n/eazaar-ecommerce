'use client';
import React, { useState, useEffect } from "react";
import DetailsThumbWrapper from "./details-thumb-wrapper";
import DetailsWrapper from "./details-wrapper";
import { useDispatch } from "react-redux";
import DetailsTabNav from "./details-tab-nav";
import RelatedProducts from "./related-products";
import ProductAdBanner from "../ads/product-ad-banner";
import { useGetBannersByPositionQuery } from "@/redux/features/bannerApi";

const ProductDetailsContent = ({ productItem }) => {
  const { _id, img, imageURLs, videoId,status } = productItem || {};
  const [activeImg, setActiveImg] = useState(img);
  const dispatch = useDispatch();

  // Fetch banner data for product details position
  const {
    data: bannerData,
    error,
    isLoading
  } = useGetBannersByPositionQuery('product-ad-banner-details');

  // active image change when img change
  useEffect(() => {
    setActiveImg(img);
  }, [img]);

  // handle image active
  const handleImageActive = (item) => {
    setActiveImg(item.img);
  };

  // Get banner content for product details
  const getBannerContent = () => {
    // Fallback content (original hardcoded)
    const fallbackContent = {
      title: "AI CODING ASSISTANT",
      subtitle: "Try the AI that tames the complexity of evolving your most sophisticated codebases",
      buttonText: "Get Started",
      buttonLink: "/contact",
      backgroundColor: "#000000",
      textColor: "#ffffff"
    };

    if (isLoading || error || !bannerData?.banners || bannerData.banners.length === 0) {
      return fallbackContent;
    }

    // Use first banner from database
    const banner = bannerData.banners[0];
    return {
      title: banner.content?.title || fallbackContent.title,
      subtitle: banner.content?.subtitle || banner.content?.description || fallbackContent.subtitle,
      buttonText: banner.link?.text || fallbackContent.buttonText,
      buttonLink: banner.link?.url || fallbackContent.buttonLink,
      backgroundColor: banner.layout?.backgroundColor || fallbackContent.backgroundColor,
      textColor: banner.layout?.textColor || fallbackContent.textColor
    };
  };
  return (
    <section className="tp-product-details-area">
      <div className="tp-product-details-top pb-115">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-6">
              {/* product-details-thumb-wrapper start */}
              <DetailsThumbWrapper
                activeImg={activeImg}
                handleImageActive={handleImageActive}
                imageURLs={imageURLs}
                imgWidth={580}
                imgHeight={670}
                videoId={videoId}
                status={status}
              />
              {/* product-details-thumb-wrapper end */}
            </div>
            <div className="col-xl-5 col-lg-6">
              {/* product-details-wrapper start */}
              <DetailsWrapper
                productItem={productItem}
                handleImageActive={handleImageActive}
                activeImg={activeImg}
                detailsBottom={true}
              />
              {/* product-details-wrapper end */}
              
              {/* product ad banner start */}
              <ProductAdBanner 
                {...getBannerContent()}
              />
              {/* product ad banner end */}
            </div>
          </div>
        </div>
      </div>

      {/* product details description */}
      <div className="tp-product-details-bottom pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <DetailsTabNav product={productItem} />
            </div>
          </div>
        </div>
      </div>
      {/* product details description */}

      {/* related products start */}
      <section className="tp-related-product pt-95 pb-50">
        <div className="container">
          <div className="row">
            <div className="tp-section-title-wrapper-6 text-center mb-40">
              <span className="tp-section-title-pre-6">Next day Products</span>
              <h3 className="tp-section-title-6">Related Products</h3>
            </div>
          </div>
          <div className="row">
            <RelatedProducts id={_id} />
          </div>
        </div>
      </section>
      {/* related products end */}
    </section>
  );
};

export default ProductDetailsContent;