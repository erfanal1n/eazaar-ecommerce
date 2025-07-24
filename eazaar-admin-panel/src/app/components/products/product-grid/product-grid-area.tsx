"use client";
import React, { useState } from "react";
import { useGetAllProductsQuery } from "@/redux/product/productApi";
import ErrorMsg from "../../common/error-msg";
import ProductGridItem from "./product-grid-item";
import Pagination from "../../ui/Pagination";
import { Search } from "@/svg";
import Link from "next/link";
import usePagination from "@/hooks/use-pagination";

const ProductGridArea = () => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("");

  // First filter all products based on search and select criteria
  let filteredProducts = products?.data || [];
  
  if (searchValue) {
    filteredProducts = filteredProducts.filter((p) =>
      p.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (selectValue) {
    filteredProducts = filteredProducts.filter((p) => p.productType === selectValue);
  }

  // Apply sorting
  if (sortValue) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortValue) {
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "date_newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date_oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "updated_newest":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "updated_oldest":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        default:
          return 0;
      }
    });
  }

  // Then apply pagination to the filtered results
  const paginationData = usePagination(filteredProducts, 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // search field
  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle select input
  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  // handle sort input
  const handleSortField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && filteredProducts.length === 0 && (products?.data?.length || 0) > 0) {
    content = <ErrorMsg msg="No Products Found matching your search" />;
  }
  if (!isLoading && !isError && products?.data.length === 0) {
    content = <ErrorMsg msg="No Products Found" />;
  }

  if (!isLoading && !isError && products?.success) {
    let productItems = [...currentItems];

    content = (
      <>
        <div className="relative mx-8 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ">
            {productItems.map((prd) => (
              <ProductGridItem key={prd._id} product={prd} />
            ))}
          </div>
        </div>

        {/* bottom  */}
        <div className="flex justify-between items-center flex-wrap mx-8">
          <p className="mb-0 text-tiny">
            Showing {currentItems.length} of{" "}
            {filteredProducts.length} {searchValue || selectValue ? `(filtered from ${products?.data.length} total)` : ''}
          </p>
          <div className="pagination py-3 flex justify-end items-center mx-8 pagination">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      <div className="tp-search-box flex items-center justify-between px-8 py-8 flex-wrap">
        <div className="search-input relative">
          <input
            onChange={handleSearchProduct}
            className="input h-[44px] w-full pl-14"
            type="text"
            placeholder="Search by product name"
          />
          <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
            <Search />
          </button>
        </div>
        <div className="flex sm:justify-end sm:space-x-6 flex-wrap">
          <div className="search-select mr-3 flex items-center space-x-3 ">
            <span className="text-tiny inline-block leading-none -translate-y-[2px]">
              Categories :{" "}
            </span>
            <select onChange={handleSelectField}>
                <option value="">Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="beauty">beauty</option>
                <option value="jewelry">jewelry</option>
              </select>
          </div>
          <div className="search-select mr-3 flex items-center space-x-3 ">
            <span className="text-tiny inline-block leading-none -translate-y-[2px]">
              Sort By :{" "}
            </span>
            <select onChange={handleSortField}>
              <option value="">Default</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="date_newest">Newest First</option>
              <option value="date_oldest">Oldest First</option>
              <option value="updated_newest">Recently Updated</option>
              <option value="updated_oldest">Least Recently Updated</option>
            </select>
          </div>
          <div className="product-add-btn flex ">
            <Link href="/add-product" className="tp-btn">
              Add Product
            </Link>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

export default ProductGridArea;
