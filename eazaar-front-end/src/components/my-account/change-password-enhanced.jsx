import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

// schema with strong password validation
const schema = Yup.object().shape({
  password: Yup.string().required("Current password is required").label("Password"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
    .label("New Password"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

// schemaTwo for Google users
const schemaTwo = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
    .label("New Password"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

const ChangePasswordEnhanced = () => {
  const { user } = useSelector((state) => state.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(user?.googleSignIn ? schemaTwo : schema),
  });

  // Watch new password for strength indicator
  const newPassword = watch("newPassword");

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    if (strength <= 2) return { strength, label: "Weak", color: "#ef4444" };
    if (strength <= 3) return { strength, label: "Fair", color: "#f59e0b" };
    if (strength <= 4) return { strength, label: "Good", color: "#10b981" };
    return { strength, label: "Strong", color: "#059669" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Eye icon component
  const EyeIcon = ({ show, onClick }) => (
    <button
      type="button"
      className="password-toggle-btn"
      onClick={onClick}
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#666",
        fontSize: "18px",
        zIndex: 10,
        padding: "0",
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
        </svg>
      )}
    </button>
  );

  // on submit
  const onSubmit = async (data) => {
    try {
      console.log("Frontend submitting data:", {
        email: user?.email,
        hasPassword: !!data.password,
        hasNewPassword: !!data.newPassword,
        googleSignIn: user?.googleSignIn,
        formData: data
      });
      
      const payload = {
        email: user?.email,
        newPassword: data.newPassword,
        googleSignIn: user?.googleSignIn,
      };
      
      // Only include current password for non-Google users
      if (!user?.googleSignIn && data.password) {
        payload.password = data.password;
      }
      
      console.log("Sending payload to API:", payload);
      
      const result = await changePassword(payload).unwrap();
      console.log("Change password success:", result);
      reset();
    } catch (error) {
      console.error("Frontend change password error:", error);
      console.error("Error details:", {
        message: error?.message,
        data: error?.data,
        status: error?.status,
        originalStatus: error?.originalStatus,
        error: error?.error
      });
      // Error handling is done in the API slice
    }
  };

  return (
    <div className="profile__password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {!user?.googleSignIn && (
            <div className="col-xxl-12">
              <div className="tp-profile-input-box">
                <div className="tp-contact-input position-relative">
                  <input
                    {...register("password", {
                      required: `Password is required!`,
                    })}
                    name="password"
                    id="password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                  />
                  <EyeIcon 
                    show={showCurrentPassword} 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                  />
                </div>
                <div className="tp-profile-input-title">
                  <label htmlFor="password">Current Password</label>
                </div>
                <ErrorMsg msg={errors.password?.message} />
              </div>
            </div>
          )}
          <div className="col-xxl-6 col-md-6">
            <div className="tp-profile-input-box">
              <div className="tp-profile-input position-relative">
                <input
                  {...register("newPassword", {
                    required: `New Password is required!`,
                  })}
                  name="newPassword"
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                />
                <EyeIcon 
                  show={showNewPassword} 
                  onClick={() => setShowNewPassword(!showNewPassword)} 
                />
              </div>
              <div className="tp-profile-input-title">
                <label htmlFor="newPassword">New Password</label>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="password-strength-indicator mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small style={{ color: passwordStrength.color, fontWeight: "600" }}>
                      {passwordStrength.label}
                    </small>
                    <small style={{ color: "#666" }}>
                      {passwordStrength.strength}/5
                    </small>
                  </div>
                  <div 
                    className="progress" 
                    style={{ height: "4px", backgroundColor: "#e9ecef" }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color,
                        transition: "all 0.3s ease"
                      }}
                    ></div>
                  </div>
                  <div className="password-requirements mt-2">
                    <small style={{ color: "#666", fontSize: "12px" }}>
                      Password must contain: 8+ chars, uppercase, lowercase, number, special char (@$!%*?&)
                    </small>
                  </div>
                </div>
              )}
              
              <ErrorMsg msg={errors.newPassword?.message} />
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="tp-profile-input-box">
              <div className="tp-profile-input position-relative">
                <input
                  {...register("confirmPassword")}
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                />
                <EyeIcon 
                  show={showConfirmPassword} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                />
              </div>
              <div className="tp-profile-input-title">
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <ErrorMsg msg={errors.confirmPassword?.message} />
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="profile__btn">
              <button 
                type="submit" 
                className="tp-btn"
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordEnhanced;