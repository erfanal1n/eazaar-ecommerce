import React from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import ErrorMsg from '../common/error-msg';
import { EmailTwo, LocationTwo, PhoneThree, UserThree } from '@/svg';
import { useUpdateProfileMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/notifications';
import { formatAddressToString, parseStringToAddress } from '@/utils/addressUtils';

// yup  schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  phone: Yup.string().min(11).label("Phone"),
  address: Yup.string().label("Address"),
  bio: Yup.string().min(20).label("Bio"),
});

const ProfileInfo = () => {
  const { user } = useSelector((state) => state.auth);

  const [updateProfile, {}] = useUpdateProfileMutation();
  
  // react hook form - ALWAYS call hooks before any conditional returns
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });

  // If no user data, return loading state AFTER all hooks are called
  if (!user) {
    return <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>
      <p>Loading user information...</p>
    </div>;
  }
  // on submit
  const onSubmit = (data) => {
    updateProfile({
      id:user?._id,
      name:data.name,
      email:data.email,
      phone:data.phone,
      address:parseStringToAddress(data.address),
      bio:data.bio,
    }).then((result) => {
      if(result?.error){
        notifyError(result?.error?.data?.message);
      }
      // Success notification is already handled in authApi.js
    })
    reset();
  };
  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>
      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("name", { required: `Name is required!` })} name='name' type="text" placeholder="Enter your username" defaultValue={user?.name} />
                  <span>
                    <UserThree/>
                  </span>
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("email", { required: `Email is required!` })} name='email' type="email" placeholder="Enter your email" defaultValue={user?.email} />
                  <span>
                    <EmailTwo/>
                  </span>
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("phone")} name='phone' type="text" placeholder="Enter your number" defaultValue={user?.phone || ""} />
                  <span>
                    <PhoneThree/>
                  </span>
                  <ErrorMsg msg={errors.phone?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("address")} name='address' type="text" placeholder="Enter your address" defaultValue={formatAddressToString(user?.address) || ""} />
                  <span>
                    <LocationTwo/>
                  </span>
                  <ErrorMsg msg={errors.address?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <textarea {...register("bio")} name='bio' placeholder="Enter your bio" defaultValue={user?.bio || ""} />
                  <ErrorMsg msg={errors.bio?.message} />
                </div>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="profile__btn">
                <button type="submit" className="tp-btn">Update Profile</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;