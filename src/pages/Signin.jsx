import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {toast} from 'react-toastify'
import OAuth from "../Components/OAuth";
import Plumber from "../assets/jpg/pilumber.jpeg"
export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
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
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
      }
      console.log(userCredential);
      sessionStorage.setItem(
        "Auth_Token",
        userCredential._tokenResponse.refreshToken
      );
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

<img src={Plumber} alt="" className="loginImage"/>
<br />
        <form onSubmit={onSubmit}>
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

          {/* //////////////// */}

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signInBar">
          <button  className="primaryButton createListingButton">
          Sign In
          </button>
            {/* <p className="signInText"></p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button> */}
          </div>
        </form>
        <p className="or">or</p>
{/* 
        <div className="signInBar">
          <button  className="primaryButton createListingButton">
          Sign In
          </button>
         
          </div> */}
       <OAuth/>
       <br />

       <br /><br /><br /><br />
        {/* <Link to="/sign-up" className="registerLink">
          Sign Up with Google
        </Link> */}
      </div>
    </>
  );
}
