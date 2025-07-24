"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Edit, Trash } from "@/svg";
import AdminUserForm from "./admin-user-form";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  image?: string;
  joiningDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminUserTableProps {
  refreshTrigger: number;
}

const AdminUserTable = ({ refreshTrigger }: AdminUserTableProps) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin/all`);
      const data = await response.json();
      
      if (data.status) {
        setUsers(data.data);
      } else {
        toast.error("Failed to fetch admin users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch admin users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete admin user "${userName}"?`)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin/${userId}`, {
          method: "DELETE",
        });
        
        const data = await response.json();
        
        if (response.ok) {
          toast.success("Admin user deleted successfully");
          fetchUsers();
        } else {
          toast.error(data.message || "Failed to delete admin user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete admin user");
      }
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
  };

  const handleEditComplete = () => {
    setEditingUser(null);
    fetchUsers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (editingUser) {
    return (
      <AdminUserForm
        editUser={editingUser}
        onEditComplete={handleEditComplete}
        onUserCreated={() => {}}
      />
    );
  }

  if (loading) {
    return (
      <div className="relative overflow-x-auto">
        <table className="w-full text-base text-left text-gray-500">
          <thead className="text-tiny text-text2 uppercase bg-gray-50">
            <tr className="border-b border-gray6 text-tiny">
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">User</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end">Email</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-end">Phone</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px] text-end">Role</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px] text-end">Status</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-end">Joining Date</th>
              <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="bg-white border-b border-gray6 last:border-0">
                <td className="px-3 py-3 font-normal text-[#55585B]">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] hidden lg:table-cell">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden md:table-cell">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-20"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden sm:table-cell">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden xl:table-cell">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-20"></div>
                </td>
                <td className="px-9 py-3 text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-base text-left text-gray-500">
        <thead className="text-tiny text-text2 uppercase bg-gray-50">
          <tr className="border-b border-gray6 text-tiny">
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-left">User</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-left hidden lg:table-cell">Email</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center hidden md:table-cell">Phone</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center">Role</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center hidden sm:table-cell">Status</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center hidden xl:table-cell">Joining Date</th>
            <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white border-b border-gray6 last:border-0">
              <td className="px-3 py-3 font-normal text-[#55585B]">
                <div className="flex items-center space-x-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-heading">{user.name}</span>
                    <div className="lg:hidden text-xs text-gray-500 mt-1">
                      {user.email}
                    </div>
                    <div className="md:hidden flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{user.phone || "N/A"}</span>
                    </div>
                    <div className="sm:hidden flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] hidden lg:table-cell">
                <span className="text-gray-600">{user.email}</span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden md:table-cell">
                <span className="text-gray-600">{user.phone || "N/A"}</span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden sm:table-cell">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden xl:table-cell">
                <span className="text-gray-600">
                  {user.joiningDate ? formatDate(user.joiningDate) : formatDate(user.createdAt)}
                </span>
              </td>
              <td className="px-9 py-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="w-10 h-10 leading-10 text-tiny bg-success text-white rounded-md hover:bg-green-600"
                    title="Edit user"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id, user.name)}
                    className="w-10 h-10 leading-[33px] text-tiny bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white"
                    title="Delete user"
                  >
                    <Trash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;