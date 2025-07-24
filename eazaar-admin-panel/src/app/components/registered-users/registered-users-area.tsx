"use client";
import React, { useState } from "react";
import { Search } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { useGetAllUsersQuery } from "@/redux/user/userApi";
import usePagination from "@/hooks/use-pagination";
import Pagination from "../ui/Pagination";
import UserTableHead from "./user-table-head";
import UserTableItem from "./user-table-item";

const RegisteredUsersArea = () => {
  const { data: users, isError, isLoading } = useGetAllUsersQuery();
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // First filter all users based on search and status criteria
  let filteredUsers = users?.data || [];
  
  if (searchValue) {
    filteredUsers = filteredUsers.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredUsers = filteredUsers.filter((user) => user.status === statusFilter);
  }

  // Then apply pagination to the filtered results
  const paginationData = usePagination(filteredUsers, 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // search field
  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle status filter
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && filteredUsers.length === 0 && (users?.data?.length || 0) > 0) {
    content = <ErrorMsg msg="No Users Found matching your search" />;
  }
  if (!isLoading && !isError && users?.data.length === 0) {
    content = <ErrorMsg msg="No Users Found" />;
  }

  if (!isLoading && !isError && users?.success) {
    let userItems = [...currentItems].reverse();

    content = (
      <>
        <div className="overflow-scroll 2xl:overflow-visible">
          <div className="w-[975px] 2xl:w-full">
            <table className="w-full text-base text-left text-gray-500 ">
              <UserTableHead />
              <tbody>
                {userItems.map((user) => (
                  <UserTableItem key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <p className="mb-0 text-tiny">Showing 1-{currentItems.length} of {filteredUsers.length}</p>
          <div className="pagination py-3 flex justify-end items-center pagination">
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
    <div className="grid grid-cols-12 gap-6 mb-6">
      <div className="bg-white p-8 col-span-12 rounded-md">
        {/* Simple Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h3 className="font-medium tracking-wide text-slate-700 text-lg mb-1 leading-none">
              Registered Users
            </h3>
            <p className="text-text2 text-sm">Manage and monitor all registered users</p>
          </div>
          
          {/* User Stats */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 px-4 py-2 rounded border">
              <span className="text-sm text-text2">Total Users: </span>
              <span className="font-semibold text-heading">{users?.data.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search />
            </div>
            <input
              type="text"
              onChange={handleSearchUser}
              value={searchValue}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name or email..."
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              onChange={handleStatusFilter}
              value={statusFilter}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchValue || statusFilter) && (
            <button
              onClick={() => {
                setSearchValue("");
                setStatusFilter("");
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Info */}
        {(searchValue || statusFilter) && (
          <div className="mb-4">
            <p className="text-sm text-text2">
              {searchValue && `Searching for "${searchValue}"`}
              {searchValue && statusFilter && " in "}
              {statusFilter && `${statusFilter} users`}
              {" - "}
              <span className="font-medium">{filteredUsers.length} results found</span>
            </p>
          </div>
        )}

        {/* Table Container */}
        <div className="relative overflow-x-auto">
          {content}
        </div>
      </div>
    </div>
  );
};

export default RegisteredUsersArea;