'use client';
import React from 'react';
// internal
import { ShapeLineSm } from '@/svg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import ProductSmItem from './product-sm-item';
import HomeSmPrdLoader from '@/components/loader/home/home-sm-prd-loader';

const ProductSmArea = () => {
  const { data: products, isError, isLoading, refetch } = useGetProductTypeQuery({type:'electronics'});
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeSmPrdLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = (
      <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "200px" }}>
        <div className="text-center">
          <i className="fa-regular fa-exclamation-triangle" style={{ fontSize: "48px", color: "#ef4444", marginBottom: "16px" }}></i>
          <h5 style={{ color: "#ef4444", marginBottom: "8px" }}>Error Loading Products</h5>
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
          <h5 style={{ color: "#6b7280", marginBottom: "8px" }}>No Products Available</h5>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Check back soon for more products!</p>
        </div>
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const discount_prd = products.data.filter(p => p.discount > 0).slice(0, 3);
    const featured_prd = products.data.filter(p => p.featured).slice(0, 3);
    const selling_prd = products.data.slice().sort((a, b) => b.sellCount - a.sellCount).slice(0, 3);
    content = <div className="row">
      <div className="col-xl-4 col-md-6">
        <div className="tp-product-sm-list mb-50">
          <div className="tp-section-title-wrapper mb-40">
            <h3 className="tp-section-title tp-section-title-sm">Discount Products
              <ShapeLineSm />
            </h3>
          </div>
          <div className="tp-product-sm-wrapper mr-20">
            {discount_prd.map(item => (
              <ProductSmItem key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="col-xl-4 col-md-6">
        <div className="tp-product-sm-list mb-50">
          <div className="tp-section-title-wrapper mb-40">
            <h3 className="tp-section-title tp-section-title-sm">Featured Products
              <ShapeLineSm />
            </h3>
          </div>

          <div className="tp-product-sm-wrapper mr-20">
            {featured_prd.map(item => (
              <ProductSmItem key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="col-xl-4 col-md-6">
        <div className="tp-product-sm-list mb-50">
          <div className="tp-section-title-wrapper mb-40">
            <h3 className="tp-section-title tp-section-title-sm">Selling Products
              <ShapeLineSm />
            </h3>
          </div>

          <div className="tp-product-sm-wrapper mr-20">
            {selling_prd.map(item => (
              <ProductSmItem key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  }
  return (
    <section className="tp-product-sm-area">
      <div className="container">
        {content}
      </div>
    </section>
  );
};

export default ProductSmArea;