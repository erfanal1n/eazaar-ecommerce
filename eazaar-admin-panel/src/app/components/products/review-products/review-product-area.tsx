"use client";
import React, { useState } from "react";
import { useGetReviewProductsQuery } from "@/redux/product/productApi";
import { Search } from "@/svg";
import ErrorMsg from "../../common/error-msg";
import ReviewItem from "./review-item";
import Pagination from "../../ui/Pagination";
import usePagination from "@/hooks/use-pagination";

const ReviewProductArea = () => {
  const {data: reviewProducts,isError,isLoading} = useGetReviewProductsQuery();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("");
  
  // First filter and sort products, then apply pagination
  let filteredProducts = reviewProducts?.data || [];
  
  // Search filter
  if (searchValue) {
    filteredProducts = filteredProducts.filter((p) =>
      p.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
  
  // Rating filter
  if (selectValue) {
    filteredProducts = filteredProducts.filter((product) => {
      const averageRating =
        product.reviews && product.reviews?.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0;
      return Math.floor(averageRating) === parseInt(selectValue);
    });
  }
  
  // Apply sorting
  if (sortValue) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortValue) {
        case "name_asc":
          return a.title.localeCompare(b.title);
        case "name_desc":
          return b.title.localeCompare(a.title);
        case "rating_high":
          const avgRatingA = a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((acc, review) => acc + review.rating, 0) / a.reviews.length
            : 0;
          const avgRatingB = b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((acc, review) => acc + review.rating, 0) / b.reviews.length
            : 0;
          return avgRatingB - avgRatingA;
        case "rating_low":
          const avgRatingA2 = a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((acc, review) => acc + review.rating, 0) / a.reviews.length
            : 0;
          const avgRatingB2 = b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((acc, review) => acc + review.rating, 0) / b.reviews.length
            : 0;
          return avgRatingA2 - avgRatingB2;
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
  
  const paginationData = usePagination(filteredProducts, 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // search field
  const handleSearchReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle select input
  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value.slice(0, 1));
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
  if (!isLoading && !isError && reviewProducts?.data.length === 0) {
    content = <ErrorMsg msg="No Product Found" />;
  }

  if (!isError && reviewProducts?.success) {
    let review_items = [...currentItems];
    content = (
      <>
        <div className="tp-search-box flex items-center justify-between px-8 py-8 flex-wrap">
          <div className="search-input relative mb-5 md:mb-0 mr-3">
            <input
              onChange={handleSearchReview}
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
                Rating :{" "}
              </span>
              <select onChange={handleSelectField}>
                <option value="">All Ratings</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
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
                <option value="rating_high">Rating (High to Low)</option>
                <option value="rating_low">Rating (Low to High)</option>
                <option value="date_newest">Newest First</option>
                <option value="date_oldest">Oldest First</option>
                <option value="updated_newest">Recently Updated</option>
                <option value="updated_oldest">Least Recently Updated</option>
              </select>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto  mx-8">
          <table className="w-[1400px] 2xl:w-full text-base text-left text-gray-500">
            <thead className="bg-white">
              <tr className="border-b border-gray6 text-tiny">
                <th
                  scope="col"
                  className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[250px] text-end"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[250px] text-end"
                >
                  Date
                </th>

                <th
                  scope="col"
                  className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[12%] text-end"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {review_items.map((item) => (
                <ReviewItem key={item._id} item={item} />
              ))}
            </tbody>
          </table>
        </div>

          <div className="flex justify-between items-center flex-wrap mx-8">
            <p className="mb-0 text-tiny mr-3">
              Showing {currentItems.length} of {filteredProducts.length} {searchValue || selectValue ? `(filtered from ${reviewProducts?.data.length} total)` : ''}
            </p>
            <div className="pagination py-3 flex justify-end items-center mr-8 pagination">
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
    <>
      <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
        {content}
      </div>
    </>
  );
};

export default ReviewProductArea;
