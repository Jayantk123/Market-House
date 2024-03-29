import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

export default function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoggleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log(user);

      // check for user
      const docSnap = await getDoc(doc(db, "users", user.uid));
      // if user doesnot exist, create usser
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };
  return (
    <>
      {/* <div className="signInBar">
        <button className="primaryButton createListingButton" onClick={onGoggleClick}>
          Sign In
          <button className="socialIconDiv" >
            <img className="socialIconImg" src={googleIcon} alt="goggle" />
          </button>
        </button>
      </div> */}

      <div className="googlelisting">
        {/* <p className="signingoogle"> Signin with Google</p> */}
        {/* <p>Sign {location.pathname === "/sign-up" ? "up" : "in"}with</p> */}
        <button className="socialIconDiv" onClick={onGoggleClick}>
          <img className="socialIconImg" src={googleIcon} alt="goggle" />
        </button>
        {/* <p className="registerLink">
          Sign Up Instead
        </p> */}
      </div>
    </>
  );
}
