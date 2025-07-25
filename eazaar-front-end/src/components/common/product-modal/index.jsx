import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactModal from "react-modal";
// internal
import { handleModalClose } from "@/redux/features/productModalSlice";
import DetailsThumbWrapper from "@/components/product-details/details-thumb-wrapper";
import DetailsWrapper from "@/components/product-details/details-wrapper";
import { initialOrderQuantity } from "@/redux/features/cartSlice";
import { useTheme } from "@/context/ThemeContext";

const getCustomStyles = (theme) => ({
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "calc(100% - 300px)",
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    border: theme === 'dark' ? '1px solid #333' : '1px solid #ccc',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  },
  overlay: {
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
  },
});

const ProductModal = () => {
  const { productItem, isModalOpen } = useSelector(
    (state) => state.productModal
  );
  const { img, imageURLs,status } = productItem || {};
  const [activeImg, setActiveImg] = useState(img);
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  // active image change when img change
  useEffect(() => {
    setActiveImg(img);
    dispatch(initialOrderQuantity())
    setLoading(false)
  }, [img,dispatch]);

  // handle image active
  const handleImageActive = (item) => {
    setActiveImg(item.img);
    setLoading(true)
  };

  return (
    <div>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => dispatch(handleModalClose())}
        style={getCustomStyles(theme)}
        contentLabel="Product Modal"
      >
        <div className={`tp-product-modal ${theme === 'dark' ? 'dark-mode' : ''}`}>
          <div className="tp-product-modal-content d-lg-flex">
            <button
              onClick={() => dispatch(handleModalClose())}
              type="button"
              className="tp-product-modal-close-btn"
            >
              <i className="fa-regular fa-xmark"></i>
            </button>
            {/* product-details-thumb-wrapper start */}
            <DetailsThumbWrapper
              activeImg={activeImg}
              handleImageActive={handleImageActive}
              imageURLs={imageURLs}
              imgWidth={416}
              imgHeight={480}
              loading={loading}
              status={status}
            />
            {/* product-details-thumb-wrapper end */}

            {/* product-details-wrapper start */}
            <DetailsWrapper
              productItem={productItem}
              handleImageActive={handleImageActive}
              activeImg={activeImg}
            />
            {/* product-details-wrapper end */}
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default ProductModal;
