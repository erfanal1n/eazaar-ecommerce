"use client";
import React, { useState } from "react";
import AdminUserTable from "./admin-user-table";
import AdminUserForm from "./admin-user-form";

const AdminUserArea = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddForm(false);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {showAddForm && (
        <div className="col-span-12 lg:col-span-4">
          <AdminUserForm onUserCreated={handleUserCreated} />
        </div>
      )}
      <div className={showAddForm ? "col-span-12 lg:col-span-8" : "col-span-12"}>
        <div className="relative overflow-x-auto bg-white px-8 py-4 rounded-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-heading">Admin Users</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="tp-btn px-7 py-2"
            >
              {showAddForm ? "Cancel" : "Add User"}
            </button>
          </div>
          <AdminUserTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default AdminUserArea;