// import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import OtpInput from "otp-input-react";
import { useState } from "react";
import OAuth from "../Components/OAuth";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Toast } from "react-bootstrap";
import carton1 from "../assets/jpg/login-img1.png";

// import { toast, Toaster } from "react-hot-toast";

export default function SignupPhone() {
    const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
const [phoneNumber,setPhoneNumber]=useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  auth.settings.appVerificationDisabledForTesting = false;

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+91" + phoneNumber;
    console.log(formatPh);

    const userCredential =  signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

      sessionStorage.setItem(
        "Auth_Token",
        userCredential._tokenResponse.refreshToken
      );
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      

        if (res.user) {
          navigate("/");
        }
      
    
    })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  const formatPhoneNumber = (input) => {
    // Implement your phone number formatting logic here
    // For example, you can add spaces or dashes for better readability
    // This is a simple example; you might want to use a library for more complex formatting
    return input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };
  const handleChange = (e) => {
    const rawInput = e.target.value;
    // Remove non-numeric characters from the input
    const numericInput = rawInput.replace(/\D/g, '');
    // Format the phone number
    const formattedNumber = formatPhoneNumber(numericInput);
    // Update the state
    setPhoneNumber(formattedNumber);
  };

  return (
    <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <img src={carton1} alt="" className="loginImage" />
        <br />
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toast toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍Login Success
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  {/* <BsFillShieldLockFill size={30} /> */}
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                   <Spinner/>
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
        
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                 
                </div>
                {/* <label
                  className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number
                </label> */}
                {/* <PhoneInput country={"in"} value={phoneNumber} onChange={setPhoneNumber} /> */}


                <input
            type="text  "
            className="emailInput"
            placeholder="Phone No. Ex-1234567890"
            value={phoneNumber}
            country={"in"}
            maxLength={10}
            id="email"
            onChange={handleChange}
          />

                {/* <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
<Spinner/>
)}
                  <span>Send code via SMS</span>
                </button > */}
                <div className="signInBar">
            <button className="primaryButton createListingButton"   onClick={onSignup}>
            {loading && (
<Spinner/>
)}
                  <span>Send code via SMS</span>
            </button>
            </div>
              </>
            )}
          </div>
        )}
      </div>
    
    </section>
    <br />
<br />
<br />
<br />

    </div>
    
  );
                    
}
