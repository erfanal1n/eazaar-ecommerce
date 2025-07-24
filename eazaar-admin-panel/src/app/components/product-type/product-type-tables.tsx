"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Pagination from '../ui/Pagination';
import ErrorMsg from '../common/error-msg';
import ProductTypeEditDelete from './edit-delete-product-type';
import { 
  useDeleteProductTypeMutation, 
  useGetAllProductTypesQuery,
  useToggleProductTypeStatusMutation 
} from '@/redux/product-type/productTypeApi';
import usePagination from '@/hooks/use-pagination';

const ProductTypeTables = () => {
  const { data: productTypes, isError, isLoading } = useGetAllProductTypesQuery();
  const [deleteProductType, { data: delData, error: delErr }] = useDeleteProductTypeMutation();
  const [toggleStatus] = useToggleProductTypeStatusMutation();
  const paginationData = usePagination(productTypes?.result || [], 8);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // handle status toggle
  const handleStatusToggle = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && productTypes?.result.length === 0) {
    content = <ErrorMsg msg="No Product Type Found" />;
  }

  if (!isLoading && !isError && productTypes?.success && currentItems.length > 0) {
    content = (
      <>
        <div className="overflow-scroll 2xl:overflow-visible">
          <div className="w-[975px] 2xl:w-full">
            <table className="w-full text-base text-left text-gray-500">
              <thead>
                <tr className="border-b border-gray6 text-tiny">
                  <th scope="col" className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[50px]">
                    Icon
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px]">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[200px]">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-center">
                    Slug
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px] text-center">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px] text-end">
                    Categories
                  </th>
                  <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id} className="bg-white border-b border-gray6 hover:bg-gray-50">
                    <td className="pr-8 py-5 whitespace-nowrap">
                      <span className="font-medium text-gray-900">#{item._id.slice(-8)}</span>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap">
                      {item.icon ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Icon</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-3 py-5">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {item.description || 'No description'}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap text-center">
                      <span className="text-sm font-mono text-gray-600">{item.slug}</span>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleStatusToggle(item._id)}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap text-end">
                      <span className="text-sm text-gray-600">
                        {item.categories?.length || 0}
                      </span>
                    </td>
                    <td className="px-9 py-5 whitespace-nowrap text-end">
                      <ProductTypeEditDelete
                        id={item._id}
                        handleDeleteProductType={deleteProductType}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* pagination start */}
        <div className="flex justify-between items-center flex-wrap">
          <p className="mb-0 text-tiny">
            Showing 1 to {currentItems.length} of {productTypes?.result.length} entries
          </p>
          <div className="pagination py-3 flex justify-end items-center">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
        {/* pagination end */}
      </>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto bg-white px-8 py-4 rounded-md">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Product Types</h1>
          <p className="text-sm text-gray-600">Manage your product type categories</p>
        </div>
        {content}
      </div>
    </>
  );
};

export default ProductTypeTables;