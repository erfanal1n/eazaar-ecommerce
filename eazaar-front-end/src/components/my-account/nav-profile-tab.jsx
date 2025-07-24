import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
// internal
import { Box, DeliveryTwo, Processing, Truck } from "@/svg";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { useTheme } from "@/context/ThemeContext";
import Loader from "../loader/loader";

const NavProfileTab = ({ orderData, orderLoading, orderError }) => {
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDark } = useTheme();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/')
  }
  return (
    <div className="profile__main">
      <div className="profile__main-top pb-80">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="profile__main-inner d-flex flex-wrap align-items-center">
              <div className="profile__main-content">
                <h4 className="profile__main-title">Welcome Mr. {user?.name}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="profile__main-logout text-sm-end">
              <a onClick={handleLogout} className="cursor-pointer tp-logout-btn">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__main-info">
        {orderLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Loader loading={true} />
          </div>
        ) : orderError ? (
          <div className="row gx-3">
            <div className="col-12">
              <div 
                className="alert alert-warning" 
                style={{
                  backgroundColor: isDark ? "#451a03" : "#fef3c7",
                  borderColor: isDark ? "#92400e" : "#f59e0b",
                  color: isDark ? "#fbbf24" : "#92400e",
                  border: `1px solid ${isDark ? "#92400e" : "#f59e0b"}`,
                  borderRadius: "8px",
                  padding: "12px 16px"
                }}
              >
                <p className="mb-0" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Unable to load order statistics at the moment. Please try refreshing the page.
                </p>
              </div>
            </div>
            {/* Show default cards with 0 values when there's an error */}
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-download">0</span>
                    <Box />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Total Order</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-order">0</span>
                    <Processing />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Pending Order</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-wishlist">0</span>
                    <Truck />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Processing Order</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-wishlist">0</span>
                    <DeliveryTwo />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Complete Order</h4>
              </div>
            </div>
          </div>
        ) : (
          <div className="row gx-3">
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-download">{orderData?.totalDoc || 0}</span>
                    <Box />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Total Order</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-order">{orderData?.pending || 0}</span>
                    <Processing />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Pending Order</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-wishlist">
                      {orderData?.processing || 0}
                    </span>
                    <Truck />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Processing Order</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="profile__main-info-item">
                <div className="profile__main-info-icon">
                  <span>
                    <span className="profile-icon-count profile-wishlist">
                      {orderData?.delivered || 0}
                    </span>
                    <DeliveryTwo />
                  </span>
                </div>
                <h4 className="profile__main-info-title">Complete Order</h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavProfileTab;
