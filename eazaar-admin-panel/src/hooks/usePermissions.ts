"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

interface Permission {
  page: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface AdminRole {
  _id: string;
  name: string;
  permissions: Permission[];
}

interface UserPermissions {
  canView: (path: string) => boolean;
  canCreate: (path: string) => boolean;
  canEdit: (path: string) => boolean;
  canDelete: (path: string) => boolean;
  hasAnyPermission: (path: string) => boolean;
  userRole: string | null;
  permissions: Permission[];
}

export const usePermissions = (): UserPermissions => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Get user from Redux store (which gets data from MongoDB)
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    fetchUserPermissions();
  }, [user]);

  const fetchUserPermissions = async () => {
    try {
      // Get user from Redux store (MongoDB data)
      if (user && user.role) {
        setUserRole(user.role);
        await fetchRolePermissions(user.role);
        return;
      }

      // Fallback: Try to get from cookies if Redux store is empty
      const cookieData = Cookies.get("admin");
      if (cookieData) {
        try {
          const parsedData = JSON.parse(cookieData);
          if (parsedData.user && parsedData.user.role) {
            setUserRole(parsedData.user.role);
            await fetchRolePermissions(parsedData.user.role);
            return;
          }
        } catch (error) {
          console.error("Error parsing cookie data:", error);
        }
      }

      // No user found - clear permissions
      setUserRole(null);
      setPermissions([]);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissions([]);
    }
  };

  const fetchRolePermissions = async (roleName: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/all`);
      const data = await response.json();

      if (data.status) {
        const userRoleData = data.data.find((role: AdminRole) => role.name === roleName);
        
        if (userRoleData) {
          setPermissions(userRoleData.permissions);
        } else {
          setPermissions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      setPermissions([]);
    }
  };

  const findPermission = (path: string): Permission | undefined => {
    return permissions.find(p => p.page === path);
  };

  const canView = (path: string): boolean => {
    if (userRole === "Super Admin") return true;
    const permission = findPermission(path);
    return permission?.canView || false;
  };

  const canCreate = (path: string): boolean => {
    if (userRole === "Super Admin") return true;
    const permission = findPermission(path);
    return permission?.canCreate || false;
  };

  const canEdit = (path: string): boolean => {
    if (userRole === "Super Admin") return true;
    const permission = findPermission(path);
    return permission?.canEdit || false;
  };

  const canDelete = (path: string): boolean => {
    if (userRole === "Super Admin") return true;
    const permission = findPermission(path);
    return permission?.canDelete || false;
  };

  const hasAnyPermission = (path: string): boolean => {
    // Super Admin always has full access
    if (userRole === "Super Admin") return true;
    
    const permission = findPermission(path);
    return permission ? (permission.canView || permission.canCreate || permission.canEdit || permission.canDelete) : false;
  };

  return {
    canView,
    canCreate,
    canEdit,
    canDelete,
    hasAnyPermission,
    userRole,
    permissions,
  };
};