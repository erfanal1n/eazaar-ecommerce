"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "../../../styles/datepicker.css";
import GlobalImgUpload from "../category/global-img-upload";

interface AdminUserFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  joiningDate: string;
  image?: string;
}

interface AdminRole {
  _id: string;
  name: string;
  description: string;
}

interface AdminUserFormProps {
  onUserCreated: () => void;
  editUser?: any;
  onEditComplete?: () => void;
}

const AdminUserForm = ({ onUserCreated, editUser, onEditComplete }: AdminUserFormProps) => {
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [userImg, setUserImg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [joiningDate, setJoiningDate] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminUserFormData>();

  useEffect(() => {
    fetchAdminRoles();
  }, []);

  useEffect(() => {
    if (editUser) {
      setValue("name", editUser.name);
      setValue("email", editUser.email);
      setValue("phone", editUser.phone || "");
      
      if (editUser.joiningDate) {
        const date = new Date(editUser.joiningDate);
        setJoiningDate(date);
        setValue("joiningDate", date.toISOString().split('T')[0]);
      }
      
      setSelectedRole(editUser.role);
      setUserImg(editUser.image || "");
    } else {
      const today = new Date();
      setJoiningDate(today);
      setValue("joiningDate", today.toISOString().split('T')[0]);
    }
  }, [editUser, setValue]);

  const fetchAdminRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin-role/all`);
      const data = await response.json();
      if (data.status) {
        setAdminRoles(data.data);
      }
    } catch (error) {
      console.error("Error fetching admin roles:", error);
      toast.error("Failed to load admin roles");
    }
  };

  const onSubmit = async (data: AdminUserFormData) => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);

    try {
      const url = editUser 
        ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin/update-stuff/${editUser._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL}/admin/add`;
      
      const method = editUser ? "PATCH" : "POST";

      const payload = {
        ...data,
        role: selectedRole,
        image: userImg,
      };

      if (editUser && !data.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && (result.status !== false)) {
        toast.success(editUser ? "Admin user updated successfully!" : "Admin user created successfully!");
        
        if (!editUser) {
          reset();
          setSelectedRole("");
          setUserImg("");
          setJoiningDate(new Date());
        }
        setIsSubmitted(false);
        
        if (editUser && onEditComplete) {
          onEditComplete();
        } else {
          onUserCreated();
        }
      } else {
        toast.error(result.message || "Failed to save admin user");
      }
    } catch (error) {
      console.error("Error saving admin user:", error);
      toast.error("Failed to save admin user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-white px-8 py-8 rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <GlobalImgUpload isSubmitted={isSubmitted} setImage={setUserImg} />

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Full Name *</p>
          <input
            type="text"
            {...register("name", { 
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Email Address *</p>
          <input
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Password {!editUser && "*"}</p>
          <input
            type="password"
            {...register("password", { 
              required: editUser ? false : "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            placeholder={editUser ? "Leave empty to keep current password" : "Enter password (min 6 characters)"}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Phone Number</p>
          <input
            type="tel"
            {...register("phone")}
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Joining Date *</p>
          <DatePicker
            selected={joiningDate}
            onChange={(date: Date | null) => {
              setJoiningDate(date);
              if (date) {
                setValue("joiningDate", date.toISOString().split('T')[0]);
              }
            }}
            maxDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            placeholderText="Click to select joining date"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            todayButton="Today"
            isClearable
            required
          />
        </div>

        <div className="mb-6">
          <p className="mb-0 text-base text-black">Admin Role *</p>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            required
          >
            <option value="">Select Role...</option>
            {adminRoles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isLoading} className="tp-btn px-7 py-2">
          {isLoading ? "Saving..." : editUser ? "Update User" : "Add User"}
        </button>

        {editUser && onEditComplete && (
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

export default AdminUserForm;