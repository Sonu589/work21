import React, { useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import "./index.js";
import hello from "./Col.png";
import advanceImage from "./Advance.png"; // Import the new image

const App = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdvancePage, setShowAdvancePage] = useState(false); // State to control the advance page

  // Add validation error state
  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    otp: "",
  });

  // Add a state variable for OTP error
  const [otpError, setOtpError] = useState(false);

  // Add a state variable to track whether OTP can be resent
  const [canResendOTP, setCanResendOTP] = useState(true);

  const otpInputsRef = useRef([]); // Create a ref for OTP input elements

  const handleResendClick = () => {
    // Resend the OTP
    resendOTP();
  };

  // Function to handle OTP resend
  const resendOTP = () => {
    // Check if the user is already verified
    if (user) {
      toast.error("You are already verified.");
      return;
    }

    // Add your logic here to resend the OTP using Firebase
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP resent successfully!");
        // Disable the Resend button after clicking
        setCanResendOTP(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to resend OTP. Please try again later.");
      });
  };

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
    // Validate phone number
    if (!ph) {
      setValidationErrors({ phone: "Phone number is required.", otp: "" });
      return;
    }

    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  // Function to handle OTP verification
  const onOTPVerify = () => {
    // Validate OTP
    if (otp.includes("")) {
      setValidationErrors({ phone: "", otp: "OTP is required." });
      return;
    }

    setLoading(true);
    window.confirmationResult
      .confirm(otp.join("")) // Join OTP values to form a single string
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        setOtpError(false); // Reset OTP error state

        // Show the advance page when OTP is verified
        setShowAdvancePage(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setOtpError(true); // Set OTP error state to true
      });
  };

  function goBack() {
    // Go back to the phone number input
    setShowOTP(false);
    setValidationErrors({ phone: "", otp: "" });
    setOtpError(false); // Reset OTP error state
    // Enable the Resend button when going back
    setCanResendOTP(true);
    // Clear the OTP input values
    setOtp(["", "", "", "", "", ""]);
    // Focus on the first OTP input field
    otpInputsRef.current[0].focus();
  }

  const handleOtpChange = (value, index) => {
    // Update OTP value
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input
    if (index < 5 && value !== "") {
      otpInputsRef.current[index + 1].focus();
    }
  };

  return (
    <div className="container">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      {!showOTP && !showAdvancePage && (
        <div className="header">
          <h1>
            <span className="Admit">Admit</span>
            <span style={{ color: "black" }}>Kard</span>
          </h1>
        </div>
      )}
      {!showOTP && !showAdvancePage && (
        <div className="mid-part">
          <h2 className="hello">Welcome Back</h2>
          <span>Please sign in to your account</span>
        </div>
      )}
      {!showAdvancePage ? (
        <div className="content">
          {showOTP ? (
            <>
              {/* OTP Verification Part */}
              <img src={hello} className="image" />
              <div className="div1">
                <h3 className="title-verify">Please verify Mobile number</h3>
                <div className="sent-to">
                  An OTP is sent to <p className="phone">{ph} </p>
                </div>
                <div className="Change-phone" onClick={goBack}>
                  Change Phone Number
                </div>
              </div>
              <div className="otp-container">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    ref={(ref) => (otpInputsRef.current[index] = ref)}
                    maxLength={1}
                    key={index}
                    type="text"
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="opt-input"
                    style={{
                      border: otpError ? "1px solid red" : "1px solid black", // Add border color based on OTP error
                    }}
                  />
                ))}
              </div>
              {validationErrors.otp && (
                <div className="validation-error">{validationErrors.otp}</div>
              )}
              {otpError && (
                <div className="validation-error">OTP is not correct.</div>
              )}
              <p className="DID">
                Didn't receive the code?{" "}
                {canResendOTP ? (
                  <span onClick={handleResendClick} className="resend-link">
                    Resend
                  </span>
                ) : (
                  <span className="resend-disabled">Resend in 60 s</span>
                )}
              </p>
              <div className="foot">
                <button onClick={onOTPVerify} className="signin-button">
                  {loading ? (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  ) : (
                    <span>Verify</span>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <fieldset className="field">
                <legend>Enter Contact Number</legend>
                <div className="setting">
                  <PhoneInput
                    country={"us"}
                    value={ph}
                    onChange={(value) => setPh(value)}
                    inputProps={{
                      autoFocus: true,
                    }}
                    containerStyle={{ width: "100%", marginBottom: "10px" }}
                    inputStyle={{ width: "100%" }}
                  />
                </div>
              </fieldset>
              {validationErrors.phone && (
                <div className="validation-error">{validationErrors.phone}</div>
              )}
              <div className="foot">
                <div className="Will">
                  We will send you a one-time SMS message. <br /> Charges may
                  apply.
                </div>
                <button
                  className="signin-button"
                  onClick={onSignup}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send code via SMS"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        // Render the advance page when showAdvancePage is true
        <div className="advance-page">
          <img src={advanceImage} alt="Advance" />
          <h1>Welcome To AdmitKard</h1>
          <p>
            In order to provide you with a custom experience,{" "}
            <h5>we need to ask you a few questions. </h5>
          </p>
          <h4>This will only take 5 min.</h4>
          <button className="signin-button">Get Started</button>
          <span>This will only take 5 min.</span>
        </div>
      )}
    </div>
  );
};

export default App;
