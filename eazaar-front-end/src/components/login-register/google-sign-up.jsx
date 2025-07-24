'use client';
import React from "react";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter,redirect } from "next/navigation";
// internal
import google_icon from "@assets/img/icon/login/google.svg";
import { useSignUpProviderMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/notifications";

const GoogleSignUp = () => {
  const [signUpProvider, {}] = useSignUpProviderMutation();
  const router = useRouter();
  // handleGoogleSignIn
  const handleGoogleSignIn = (user) => {
    if (user) {
      signUpProvider(user?.credential).then((res) => {
        if (res?.data) {
          // Success notification is already handled in authApi
          router.push('/profile');
        } else {
          console.log("result error -->", res.error);
          notifyError(res.error?.message);
        }
      });
    }
  };
  return (
    <div className="cursor-pointer">
      <GoogleLogin
        onSuccess={handleGoogleSignIn}
        onError={(err) =>
          notifyError(err?.message || "Something wrong on your auth setup!")
        }
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleSignUp;
