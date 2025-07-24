'use client';
import React,{useState} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import * as Yup from "yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useAddReviewMutation } from "@/redux/features/reviewApi";
import { notifyError, notifySuccess } from "@/utils/notifications";

// schema
const schema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name must be at least 2 characters long"),
  email: Yup.string()
    .required("Please enter your email address")
    .email("Please enter a valid email address"),
  comment: Yup.string()
    .required("Please write your review comment")
    .min(10, "Review comment must be at least 10 characters long")
    .max(500, "Review comment cannot exceed 500 characters"),
});

const ReviewForm = ({product_id}) => {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [addReview, {}] = useAddReviewMutation();

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate)
  }

   // react hook form
   const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    if(!user){
      notifyError("Please login to submit a review");
      return;
    }
    
    // Validate rating
    if(!rating || rating === 0){
      notifyError("Please select a rating (1-5 stars) for this product");
      return;
    }
    
    addReview({
      userId: user?._id,
      productId: product_id,
      rating: rating,
      comment: data.comment,
    }).then((result) => {
      if (result?.error) {
        // Make backend error messages more user-friendly
        const errorMessage = result?.error?.data?.message;
        if(errorMessage?.includes("already left a review")) {
          notifyError("You have already reviewed this product. You can only review a product once.");
        } else if(errorMessage?.includes("required")) {
          notifyError("Please fill in all required fields to submit your review.");
        } else {
          notifyError(errorMessage || "Unable to submit review. Please try again.");
        }
      } else {
        notifySuccess("Thank you! Your review has been submitted successfully.");
        reset();
        setRating(0);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-product-details-review-form-rating d-flex align-items-center">
        <p>Your Rating <span style={{color: 'red'}}>*</span> :</p>
        <div className="tp-product-details-review-form-rating-icon d-flex align-items-center">
          <Rating onClick={handleRating} allowFraction size={16} initialValue={rating} />
        </div>
      </div>
      {!rating && (
        <p style={{color: '#dc3545', fontSize: '14px', marginTop: '5px'}}>
          Please select a rating to continue
        </p>
      )}
      <div className="tp-product-details-review-input-wrapper">
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <textarea
            {...register("comment", { required: `Comment is required!` })}
              id="comment"
              name="comment"
              placeholder="Write your review here..."
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="msg">Your Review</label>
          </div>
          <ErrorMsg msg={errors.comment?.message} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("name", { required: `Name is required!` })}
              name="name"
              id="name"
              type="text"
              placeholder="Erfan Alin"
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="name">Your Name</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("email", { required: `Email is required!` })}
              name="email"
              id="email"
              type="email"
              placeholder="eazaar@mail.com"
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
      </div>
      <div className="tp-product-details-review-btn-wrapper">
        <button type="submit" className="tp-product-details-review-btn">Submit</button>
      </div>
    </form>
  );
};

export default ReviewForm;
