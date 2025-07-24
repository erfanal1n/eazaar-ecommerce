"use client"
import React, { useEffect, useState } from 'react';
import ReactSelect from "react-select";

// prop type 
type IPropType = {
  handleChange: (value: string | number | undefined) => void;
  default_value?: string;
  setRole?: React.Dispatch<React.SetStateAction<string>>;
}

interface AdminRole {
  _id: string;
  name: string;
  description: string;
}

const AdminRole = ({ handleChange, default_value, setRole }: IPropType) => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (default_value && setRole) {
      setRole(default_value)
    }
  }, [default_value, setRole])

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/all`);
      const data = await response.json();
      if (data.status) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      // Fallback to default roles if API fails
      setRoles([
        { _id: "1", name: "Admin", description: "Admin role" },
        { _id: "2", name: "Super Admin", description: "Super Admin role" },
        { _id: "3", name: "Manager", description: "Manager role" },
        { _id: "4", name: "CEO", description: "CEO role" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const options = roles.map(role => ({
    value: role.name,
    label: role.name,
  }));

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <ReactSelect
      onChange={(value) => handleChange(value?.value)}
      defaultValue={
        default_value
          ? {
              label: default_value,
              value: default_value,
            }
          : {
              label: "Select..",
              value: 0,
            }
      }
      options={options}
    />
  );
};

export default AdminRole;