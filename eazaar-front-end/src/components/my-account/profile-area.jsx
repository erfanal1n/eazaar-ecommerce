'use client'
import React,{ useEffect, useState } from "react";
import ProfileNavTab from "./profile-nav-tab";
import ProfileShape from "./profile-shape";
import NavProfileTab from "./nav-profile-tab";
import ProfileInfo from "./profile-info";
import ChangePassword from "./change-password-enhanced";
import MyOrders from "./my-orders";
import { useGetUserOrdersQuery } from "@/redux/features/order/orderApi";
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";
import ErrorMsg from "../common/error-msg";
import Cookies from "js-cookie";

const ProfileArea = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Always call hooks in the same order - check auth state first
  useEffect(() => {
    const userInfo = Cookies.get("userInfo");
    if (!userInfo) {
      setIsAuthenticated(false);
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  // Only call the query hook if authenticated to prevent unnecessary calls
  const { 
    data: orderData, 
    isError: orderError, 
    isLoading: orderLoading 
  } = useGetUserOrdersQuery(undefined, {
    skip: !isAuthenticated
  });

  // Early return if not authenticated but still render something to avoid hooks mismatch
  if (!isAuthenticated) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <Loader loading={true} />
      </div>
    );
  }

  // Loading state
  if (orderLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <Loader loading={orderLoading} />
      </div>
    );
  }

  // Error state
  if (orderError) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <ErrorMsg msg="There was an error loading your profile" />
      </div>
    );
  }

  // Main profile content
  return (
    <section className="profile__area pt-120 pb-120">
      <div className="container">
        <div className="profile__inner p-relative">
          <ProfileShape />
          <div className="row">
            <div className="col-xxl-4 col-lg-4">
              <div className="profile__tab mr-40">
                <ProfileNavTab />
              </div>
            </div>
            <div className="col-xxl-8 col-lg-8">
              <div className="profile__tab-content">
                <div className="tab-content" id="profile-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-profile"
                    role="tabpanel"
                    aria-labelledby="nav-profile-tab"
                  >
                    <NavProfileTab orderData={orderData} />
                  </div>

                  <div
                    className="tab-pane fade"
                    id="nav-information"
                    role="tabpanel"
                    aria-labelledby="nav-information-tab"
                  >
                    <ProfileInfo />
                  </div>

                  <div
                    className="tab-pane fade"
                    id="nav-password"
                    role="tabpanel"
                    aria-labelledby="nav-password-tab"
                  >
                    <ChangePassword />
                  </div>

                  <div
                    className="tab-pane fade"
                    id="nav-order"
                    role="tabpanel"
                    aria-labelledby="nav-order-tab"
                  >
                    <MyOrders orderData={orderData} orderLoading={orderLoading} orderError={orderError} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileArea;
