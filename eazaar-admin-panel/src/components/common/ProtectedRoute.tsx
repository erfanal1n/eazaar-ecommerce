"use client";
import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPath: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPath, 
  fallback 
}) => {
  const { hasAnyPermission, userRole } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (userRole && userRole !== "Super Admin" && !hasAnyPermission(requiredPath)) {
      // Redirect to dashboard or show access denied
      router.push("/dashboard");
    }
  }, [userRole, requiredPath, hasAnyPermission, router]);

  // Show loading while checking permissions
  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  // Check if user has permission (Super Admin always has access)
  if (userRole !== "Super Admin" && !hasAnyPermission(requiredPath)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;