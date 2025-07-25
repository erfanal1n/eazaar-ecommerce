'use client';
import React, { useEffect, useState } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import { ShapeLine, TabLine } from "@/svg";
import ProductItem from "./product-item";
import HomePrdLoader from "@/components/loader/home/home-prd-loader";

const tabs = ["new", "featured", "topSellers"];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState("new");
  const {data:products,isError,isLoading,refetch} = 
  useGetProductTypeQuery({type:'electronics',query:`${activeTab}=true`});
  // handleActiveTab
  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };
  // refetch when active value change
  useEffect(() => {
    refetch()
  },[activeTab,refetch])

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomePrdLoader loading={isLoading}/>
    );
  }
  if (!isLoading && isError) {
    content = (
      <div className="col-12">
        <div 
          className="d-flex align-items-center justify-content-center py-5"
          style={{ minHeight: "200px" }}
        >
          <div className="text-center">
            <i 
              className="fa-regular fa-exclamation-triangle" 
              style={{ 
                fontSize: "48px", 
                color: "#ef4444",
                marginBottom: "16px"
              }}
            ></i>
            <h5 style={{ color: "#ef4444", marginBottom: "8px" }}>
              Error Loading Products
            </h5>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = (
      <div className="col-12">
        <div 
          className="d-flex align-items-center justify-content-center py-5"
          style={{ minHeight: "200px" }}
        >
          <div className="text-center">
            <i 
              className="fa-regular fa-box-open" 
              style={{ 
                fontSize: "48px", 
                color: "#6b7280",
                marginBottom: "16px"
              }}
            ></i>
            <h5 style={{ color: "#6b7280", marginBottom: "8px" }}>
              No Products Available
            </h5>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
              We&apos;re working on adding more products to this category.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;
    content = product_items.map((prd,i) => (
      <div key={i} className="col-xl-3 col-lg-3 col-sm-6">
        <ProductItem product={prd}/>  
    </div>
    ))
  }
  return (
    <section className="tp-product-area pb-55">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-xl-5 col-lg-6 col-md-5">
            <div className="tp-section-title-wrapper mb-40">
              <h3 className="tp-section-title">
                Trending Products
                <ShapeLine />
              </h3>
            </div>
          </div>
          <div className="col-xl-7 col-lg-6 col-md-7">
            <div className="tp-product-tab tp-product-tab-border mb-45 tp-tab d-flex justify-content-md-end">
              <ul className="nav nav-tabs justify-content-sm-end">
                {tabs.map((tab, i) => (
                  <li key={i} className="nav-item">
                    <button
                      onClick={() => handleActiveTab(tab)}
                      className={`nav-link text-capitalize ${
                        activeTab === tab ? "active" : ""
                      }`}
                    >
                      {tab.split("-").join(" ")}
                      <span className="tp-product-tab-line">
                        <TabLine />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          {content}
        </div>
      </div>
    </section>
  );
};

export default ProductArea;
