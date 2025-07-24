"use client";
import React from "react";
import Image from "next/image";
import UserActions from "./user-actions";
import { formatAddressToString, IAddress } from "@/utils/addressUtils";

interface IUser {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  phone?: string;
  address?: string | IAddress;
  shippingAddress?: string | IAddress;
  imageURL?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'blocked';
  role: 'user' | 'admin';
  orderCount: number;
  createdAt: string;
  updatedAt: string;
}

interface IProps {
  user: IUser;
}

const UserTableItem = ({ user }: IProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "text-success bg-success/10",
      inactive: "text-warning bg-warning/10", 
      blocked: "text-danger bg-danger/10"
    };
    
    return (
      <span className={`text-[11px] px-3 py-1 rounded-md leading-none font-medium text-end ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <tr className="bg-white dark:bg-slate-800 border-b border-gray6 dark:border-slate-600 last:border-0 text-start mx-9 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
      <td className="pr-8 py-5 whitespace-nowrap w-[250px]">
        <div className="flex items-center space-x-3 max-w-full">
          {user.imageURL ? (
            <Image className="w-[60px] h-[60px] rounded-md flex-shrink-0" src={user.imageURL} alt="image" width={60} height={60} />
          ) : (
            <div className="w-[60px] h-[60px] rounded-md bg-gray dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
              <span className="text-heading dark:text-slate-200 font-medium text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-medium text-heading dark:text-slate-200 truncate">{user.name}</span>
        </div>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] dark:text-slate-300 text-end w-[200px]">
        <div className="truncate">
          {user.email}
        </div>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] dark:text-slate-300 text-end w-[120px]">
        {user.contactNumber || user.phone || 'N/A'}
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] dark:text-slate-300 text-end w-[80px]">
        {user.orderCount}
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] dark:text-slate-300 text-end w-[100px]">
        {getStatusBadge(user.status)}
      </td>
      <td className="px-9 py-3 text-end w-[120px]">
        <UserActions user={user} />
      </td>
    </tr>
  );
};

export default UserTableItem;