'use client';
// external
import React, { useState } from "react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";
// internal
import slider_img_1 from "@assets/img/slider/slider-img-1.png";
import slider_img_2 from "@assets/img/slider/slider-img-2.png";
import slider_img_3 from "@assets/img/slider/slider-img-3.png";
import shape_1 from "@assets/img/slider/shape/slider-shape-1.png";
import shape_2 from "@assets/img/slider/shape/slider-shape-2.png";
import shape_3 from "@assets/img/slider/shape/slider-shape-3.png";
import shape_4 from "@assets/img/slider/shape/slider-shape-4.png";
import { ArrowRightLong, SliderNextBtn, SliderPrevBtn, TextShape } from "@/svg";
import { useGetBannersByPositionQuery } from "@/redux/features/bannerApi";

// fallback slider data (original hardcoded data)
const fallbackSliderData = [
  {
    id: 1,
    pre_title: { text: "Starting at", price: 274, formattedPrice: "$274" },
    title: "The best tablet Collection 2023",
    subtitle: {
      text_1: "Exclusive offer ",
      percent: 35,
      text_2: "off this week",
    },
    img: slider_img_1,
    green_bg: true,
  },
  {
    id: 2,
    pre_title: { text: "Starting at", price: 999, formattedPrice: "$999" },
    title: "The best note book collection 2023",
    subtitle: {
      text_1: "Exclusive offer ",
      percent: 10,
      text_2: "off this week",
    },
    img: slider_img_2,
    green_bg: true,
  },
  {
    id: 3,
    pre_title: { text: "Starting at", price: 999, formattedPrice: "$999" },
    title: "The best note book collection 2023",
    subtitle: {
      text_1: "Exclusive offer ",
      percent: 10,
      text_2: "off this week",
    },
    img: slider_img_3,
    is_light: true,
  },
];

function Shape({ img, num }) {
  
  return (
    <Image 
      className={`tp-slider-shape-${num}`} 
      src={img} 
      alt="slider-shape" 
      priority 
    />
  );
}

const HomeHeroSlider = () => {
  const [active, setActive] = useState(false);
  const { formatPriceSimple } = useCurrency();

  // Fetch banner data from database
  const {
    data: bannerData,
    error,
    isLoading
  } = useGetBannersByPositionQuery('hero-slider');

  // Determine which data to use
  const getSliderData = () => {
    if (isLoading || error || !bannerData?.banners || bannerData.banners.length === 0) {
      return fallbackSliderData;
    }

    // Transform database banners to match original format
    return bannerData.banners.map((banner, index) => ({
      id: banner._id || index + 1,
      pre_title: { 
        text: banner.content?.subtitle || "Starting at", 
        price: banner.content?.price || 274,
        formattedPrice: formatPriceSimple(banner.content?.price || 274)
      },
      title: banner.content?.title || "Default Title",
      subtitle: {
        text_1: banner.content?.description?.split(' ').slice(0, 2).join(' ') || "Exclusive offer",
        percent: banner.content?.discount || 35,
        text_2: banner.content?.description?.split(' ').slice(2).join(' ') || "off this week",
      },
      img: banner.media?.url ? { src: banner.media.url } : fallbackSliderData[index % 3]?.img,
      green_bg: banner.layout?.theme !== 'light',
      is_light: banner.layout?.theme === 'light',
      link: banner.link?.url || '/shop'
    }));
  };

  const sliderData = getSliderData();

  // handleActiveIndex
  const handleActiveIndex = (index) => {
    const currentSlide = sliderData[index];
    if (currentSlide?.is_light) {
      setActive(true);
    } else {
      setActive(false);
    }
  }
  return (
    <>
      <section className="tp-slider-area p-relative z-index-1">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={false}
          effect="fade"
          navigation={{
            nextEl: ".tp-slider-button-next",
            prevEl: ".tp-slider-button-prev",
          }}
          onSlideChange={(swiper) => handleActiveIndex(swiper.activeIndex)}
          pagination={{ el: ".tp-slider-dot", clickable: true }}
          modules={[Navigation, Pagination, EffectFade]}
          className={`tp-slider-active tp-slider-variation swiper-container ${
            active ? "is-light" : ""
          }`}
        >
          {sliderData.map((item) => (
            <SwiperSlide
              key={item.id}
              className={`tp-slider-item tp-slider-height d-flex align-items-center ${
                item?.green_bg
                  ? "green-dark-bg"
                  : item?.is_light
                  ? "is-light"
                  : ""
              }`}
              style={{ backgroundColor: item.is_light && "#E3EDF6" }}
            >
              <div className="tp-slider-shape">
                <Shape img={shape_1} num="1" />
                <Shape img={shape_2} num="2" />
                <Shape img={shape_3} num="3" />
                <Shape img={shape_4} num="4" />
              </div>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-5 col-lg-6 col-md-6">
                    <div className="tp-slider-content p-relative z-index-1">
                      <span>
                        {item.pre_title.text} <b>{item.pre_title.formattedPrice || item.pre_title.price}</b>
                      </span>
                      <h3 className="tp-slider-title">{item.title}</h3>
                      <p>
                        {item.subtitle.text_1}
                        <span>
                          -{item.subtitle.percent}%
                          <TextShape />
                        </span>{" "}
                        {item.subtitle.text_2}
                      </p>

                      <div className="tp-slider-btn">
                        <Link href={item.link || "/shop"} className="tp-btn tp-btn-2 tp-btn-white">
                          Shop Now
                          {" "} <ArrowRightLong />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-6 col-md-6">
                    <div className="tp-slider-thumb text-end">
                      {item.img?.src ? (
                        <Image 
                          src={item.img.src} 
                          alt={item.title || "slider-img"} 
                          width={600}
                          height={400}
                          priority={true}
                        />
                      ) : (
                        <Image src={item.img} alt="slider-img" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="tp-slider-arrow tp-swiper-arrow">
            <button type="button" className="tp-slider-button-prev">
              <SliderPrevBtn />
            </button>
            <button type="button" className="tp-slider-button-next">
              <SliderNextBtn />
            </button>
          </div>
          <div className="tp-slider-dot tp-swiper-dot"></div>
        </Swiper>
      </section>
    </>
  );
};

export default HomeHeroSlider;
