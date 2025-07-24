'use client'
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast';
import Modal from "react-modal";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}
// internal
import BackToTopCom from "@/components/common/back-to-top";
import ProductModal from "@/components/common/product-modal";
import {get_cart_products,initialOrderQuantity} from "@/redux/features/cartSlice";
import { get_wishlist_products } from "@/redux/features/wishlist-slice";
import { get_compare_products } from "@/redux/features/compareSlice";
import useAuthCheck from "@/hooks/use-auth-check";
import { useTheme } from "@/context/ThemeContext";
import Loader from "@/components/loader/loader";

const Wrapper = ({ children }) => {
  const { productItem } = useSelector((state) => state.productModal);
  const dispatch = useDispatch();
  const authChecked = useAuthCheck();
  const { isDark } = useTheme();

  useEffect(() => {
    dispatch(get_cart_products());
    dispatch(get_wishlist_products());
    dispatch(get_compare_products());
    dispatch(initialOrderQuantity());
    
    // Set app element for react-modal accessibility
    if (typeof window !== "undefined") {
      Modal.setAppElement('body');
    }
  }, [dispatch]);

  return !authChecked ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Loader spinner="fade" loading={!authChecked} />
    </div>
  ) : (
    <div id="wrapper">
      {children}
      <BackToTopCom />
      {/* product modal start */}
      {productItem && <ProductModal />}
      {/* product modal end */}
      
      {/* React Hot Toast - Form-Centered & Responsive */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="toast-container"
        containerStyle={{
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}
        toastOptions={{
          className: 'custom-toast',
          duration: 4000,
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#1e293b',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
              : '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: isDark 
              ? '1px solid #334155' 
              : '1px solid #e2e8f0',
            maxWidth: '90vw',
            width: 'auto',
            minWidth: '280px',
            textAlign: 'center',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: '600',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#fff',
              fontWeight: '600',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: '#fff',
              fontWeight: '600',
            },
          },
        }}
      />
    </div>
  );
};

export default Wrapper;
