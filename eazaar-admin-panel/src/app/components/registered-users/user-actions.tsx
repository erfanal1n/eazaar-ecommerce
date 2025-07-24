"use client";
import React, { useState } from "react";
import { Edit, Delete, View } from "@/svg";
import { useDeleteUserMutation, useToggleUserBlockMutation } from "@/redux/user/userApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import EditUserModal from "./edit-user-modal";
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

const UserActions = ({ user }: IProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteUser] = useDeleteUserMutation();
  const [toggleUserBlock] = useToggleUserBlockMutation();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      try {
        const result = await deleteUser(user._id).unwrap();
        notifySuccess(result.message);
      } catch (error: any) {
        notifyError(error?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleToggleBlock = async () => {
    const action = user.status === 'blocked' ? 'unblock' : 'block';
    const confirmMessage = action === 'block' 
      ? `Are you sure you want to block user "${user.name}"? They won't be able to access the site.`
      : `Are you sure you want to unblock user "${user.name}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const result = await toggleUserBlock({ id: user._id, action }).unwrap();
        notifySuccess(result.message);
      } catch (error: any) {
        notifyError(error?.data?.message || `Failed to ${action} user`);
      }
    }
  };

  const handleViewDetails = () => {
    // Create a detailed view modal or navigate to user details page
    alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.contactNumber || user.phone || 'Not provided'}\nAddress: ${formatAddressToString(user.address) || 'Not provided'}\nShipping Address: ${formatAddressToString(user.shippingAddress) || 'Not provided'}\nBio: ${user.bio || 'Not provided'}\nStatus: ${user.status}\nTotal Orders: ${user.orderCount}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}`);
  };

  return (
    <div className="flex items-center justify-end space-x-1">
      <button
        onClick={handleViewDetails}
        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
      >
        <View />
      </button>

      <button
        onClick={() => setShowEditModal(true)}
        className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
      >
        <Edit />
      </button>

      <button
        onClick={handleToggleBlock}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          user.status === 'blocked'
            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600'
            : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
        }`}
      >
        <span className="text-xs font-bold">
          {user.status === 'blocked' ? '🔓' : '🔒'}
        </span>
      </button>

      <button
        onClick={handleDelete}
        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
      >
        <Delete />
      </button>

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          user={user}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default UserActions;