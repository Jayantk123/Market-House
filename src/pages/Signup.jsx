import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
   name:"",
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
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form>
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

        
        {/* g oauth */}
        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}