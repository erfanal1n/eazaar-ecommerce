"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Edit, Trash } from "@/svg";
import AdminRoleForm from "./admin-role-form";

interface AdminRole {
  _id: string;
  name: string;
  description: string;
  permissions: any[];
  isActive: boolean;
  isSystemRole: boolean;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AdminRoleTableProps {
  refreshTrigger: number;
}

const AdminRoleTable = ({ refreshTrigger }: AdminRoleTableProps) => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    fetchRoles();
  }, [refreshTrigger]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/all`);
      const data = await response.json();
      
      if (data.status) {
        setRoles(data.data);
      } else {
        toast.error("Failed to fetch admin roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch admin roles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId: string, roleName: string, isSystemRole: boolean) => {
    if (isSystemRole) {
      toast.error("System roles cannot be deleted");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/${roleId}`, {
          method: "DELETE",
        });
        
        const data = await response.json();
        
        if (data.status) {
          toast.success("Role deleted successfully");
          fetchRoles();
        } else {
          toast.error(data.message || "Failed to delete role");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("Failed to delete role");
      }
    }
  };

  const handleEdit = (role: AdminRole) => {
    if (role.isSystemRole) {
      toast.error("System roles cannot be edited");
      return;
    }
    setEditingRole(role);
  };

  const handleEditComplete = () => {
    setEditingRole(null);
    fetchRoles();
  };

  if (editingRole) {
    return (
      <AdminRoleForm
        editRole={editingRole}
        onEditComplete={handleEditComplete}
        onRoleCreated={() => {}}
      />
    );
  }

  if (loading) {
    return (
      <div className="relative overflow-x-auto">
        <table className="w-full text-base text-left text-gray-500">
          <thead className="text-tiny text-text2 uppercase bg-gray-50">
            <tr className="border-b border-gray6 text-tiny">
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">Role Name</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end">Description</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-end">Permissions</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px] text-end">Type</th>
              <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-end">Created By</th>
              <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="bg-white border-b border-gray6 last:border-0">
                <td className="px-3 py-3 font-normal text-[#55585B]">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] hidden md:table-cell">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden sm:table-cell">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden lg:table-cell">
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
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-left">Role Name</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-left hidden md:table-cell">Description</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center">Permissions</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center hidden sm:table-cell">Type</th>
            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-center hidden lg:table-cell">Created By</th>
            <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id} className="bg-white border-b border-gray6 last:border-0">
              <td className="px-3 py-3 font-normal text-[#55585B]">
                <div>
                  <span className="font-medium text-heading">{role.name}</span>
                  <div className="md:hidden text-xs text-gray-500 mt-1">
                    {role.description || "No description"}
                  </div>
                  <div className="sm:hidden flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      role.isSystemRole 
                        ? "bg-red-100 text-red-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {role.isSystemRole ? "System" : "Custom"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] hidden md:table-cell">
                <span className="text-gray-600 max-w-xs truncate block">
                  {role.description || "No description"}
                </span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {role.permissions?.length || 0} pages
                </span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden sm:table-cell">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  role.isSystemRole 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {role.isSystemRole ? "System" : "Custom"}
                </span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B] text-center hidden lg:table-cell">
                <span className="text-gray-600">
                  {role.createdBy?.name || "System"}
                </span>
              </td>
              <td className="px-9 py-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(role)}
                    disabled={role.isSystemRole}
                    className={`w-10 h-10 leading-10 text-tiny rounded-md ${
                      role.isSystemRole 
                        ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" 
                        : "bg-success text-white hover:bg-green-600"
                    }`}
                    title={role.isSystemRole ? "System roles cannot be edited" : "Edit role"}
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(role._id, role.name, role.isSystemRole)}
                    disabled={role.isSystemRole}
                    className={`w-10 h-10 leading-[33px] text-tiny rounded-md ${
                      role.isSystemRole 
                        ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-300" 
                        : "bg-white border border-gray text-slate-600 hover:bg-danger hover:border-danger hover:text-white"
                    }`}
                    title={role.isSystemRole ? "System roles cannot be deleted" : "Delete role"}
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

export default AdminRoleTable;