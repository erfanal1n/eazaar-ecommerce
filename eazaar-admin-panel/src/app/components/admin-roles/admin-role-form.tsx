"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Permission {
  page: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface AdminRoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
}

interface AvailablePage {
  name: string;
  path: string;
}

interface AdminRoleFormProps {
  onRoleCreated: () => void;
  editRole?: any;
  onEditComplete?: () => void;
}

const AdminRoleForm = ({ onRoleCreated, editRole, onEditComplete }: AdminRoleFormProps) => {
  const [availablePages, setAvailablePages] = useState<AvailablePage[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminRoleFormData>();

  useEffect(() => {
    fetchAvailablePages();
  }, []);

  useEffect(() => {
    if (editRole) {
      setValue("name", editRole.name);
      setValue("description", editRole.description);
      setPermissions(editRole.permissions || []);
    }
  }, [editRole, setValue]);

  const fetchAvailablePages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/available-pages`);
      const data = await response.json();
      if (data.status) {
        setAvailablePages(data.data);
        const initialPermissions = data.data.map((page: AvailablePage) => ({
          page: page.path,
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        }));
        setPermissions(initialPermissions);
      }
    } catch (error) {
      console.error("Error fetching available pages:", error);
      toast.error("Failed to load available pages");
    }
  };

  const handlePermissionChange = (pageIndex: number, permission: keyof Omit<Permission, 'page'>, value: boolean) => {
    setPermissions(prev => {
      const updated = [...prev];
      updated[pageIndex] = { ...updated[pageIndex], [permission]: value };
      return updated;
    });
  };

  const onSubmit = async (data: AdminRoleFormData) => {
    setIsLoading(true);
    try {
      const url = editRole 
        ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/${editRole._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/create`;
      
      const method = editRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          permissions,
        }),
      });

      const result = await response.json();

      if (result.status) {
        toast.success(editRole ? "Role updated successfully!" : "Role created successfully!");
        reset();
        setPermissions(availablePages.map(page => ({
          page: page.path,
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        })));
        if (editRole && onEditComplete) {
          onEditComplete();
        } else {
          onRoleCreated();
        }
      } else {
        toast.error(result.message || "Failed to save role");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-white px-8 py-8 rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <p className="mb-0 text-base text-black">Role Name *</p>
          <input
            type="text"
            {...register("name", { required: "Role name is required" })}
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            placeholder="Enter role name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Description</p>
          <textarea
            {...register("description")}
            className="input w-full h-[120px] rounded-md border border-gray6 px-6 py-3 text-base resize-none"
            placeholder="Enter role description"
          />
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Permissions</p>
          <div className="max-h-96 overflow-y-auto border border-gray6 rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray6 text-tiny">
                  <th className="px-3 py-2 text-left text-tiny text-text2 uppercase font-semibold">Page</th>
                  <th className="px-2 py-2 text-center text-tiny text-text2 uppercase font-semibold">View</th>
                  <th className="px-2 py-2 text-center text-tiny text-text2 uppercase font-semibold">Create</th>
                  <th className="px-2 py-2 text-center text-tiny text-text2 uppercase font-semibold">Edit</th>
                  <th className="px-2 py-2 text-center text-tiny text-text2 uppercase font-semibold">Delete</th>
                </tr>
              </thead>
              <tbody>
                {availablePages.map((page, index) => {
                  const permission = permissions[index];
                  if (!permission) return null;
                  
                  return (
                    <tr key={page.path} className="bg-white border-b border-gray6 last:border-0">
                      <td className="px-3 py-2 font-medium text-heading">{page.name}</td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={permission.canView}
                          onChange={(e) => handlePermissionChange(index, 'canView', e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={permission.canCreate}
                          onChange={(e) => handlePermissionChange(index, 'canCreate', e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={permission.canEdit}
                          onChange={(e) => handlePermissionChange(index, 'canEdit', e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={permission.canDelete}
                          onChange={(e) => handlePermissionChange(index, 'canDelete', e.target.checked)}
                          className="rounded"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="tp-btn px-7 py-2">
          {isLoading ? "Saving..." : editRole ? "Update Role" : "Add Role"}
        </button>

        {editRole && onEditComplete && (
          <button
            type="button"
            onClick={onEditComplete}
            className="tp-btn-border px-7 py-2 ml-3"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminRoleForm;