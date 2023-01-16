import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {toast} from 'react-toastify'

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import OAuth from "../Components/OAuth";
export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const { name, email, password, confirmpassword } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if ((password === confirmpassword) & (password.length >= 6)) {
        const auth = getAuth();
        console.log(auth);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        sessionStorage.setItem('Auth_Token',userCredential._tokenResponse.refreshToken);
        console.log(userCredential._tokenResponse.refreshToken);
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
          displayName: name,
        });

        const uploadingFormData = { ...formData };
        delete uploadingFormData.password;
        delete uploadingFormData.confirmpassword;
        uploadingFormData.timestamp = serverTimestamp();

        // save user to firestore database
        await setDoc(doc(db, "users", user.uid), uploadingFormData);

        // redirected to explore page
        navigate("/");
      } else if ((password === confirmpassword) & (password.length < 6)) {
        toast.error("Password length should be atleast 6 characters.");
      } else {
        toast.error("Your password and confirm password do not match!");
        setFormData({
          name: name,
          email: email,
          password: password,
          confirmpassword: "",
        });
      }
    } catch (error) {
      toast.error('Bad User Credentials')
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          {/* namea */}
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            value={name}
            id="name"
            onChange={onChange}
          />

          {/* email */}
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            id="email"
            onChange={onChange}
          />

          {/* password */}
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="showPassword"
              className="showPassword"
              onClick={() => {
                setShowPassword((prevState) => !prevState);
              }}
            />
          </div>

          {/* confirm password */}
          <div className="passwordInputDiv">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Confirm Password"
              id="confirmpassword"
              value={confirmpassword}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="showConfirmPassword"
              className="showPassword"
              onClick={() => {
                setShowConfirmPassword((prevState) => !prevState);
              }}
            />
          </div>
          {/* //////////////// */}

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signUpBar">
            <p className="signUpText">Sign Up </p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

       <OAuth/>
        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}
