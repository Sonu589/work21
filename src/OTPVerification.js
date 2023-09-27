import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { auth } from "./firebase.config";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

const OTPVerification = () => {
  const location = useLocation();
  const history = useHistory();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (location.state && location.state.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    }
  }, [location.state]);

  const handleResendCode = async () => {
    try {
      const recaptchaVerifier = new auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      const formatPhone = "+1" + phoneNumber; // Adjust the country code as needed

      const newConfirmationResult = await auth.signInWithPhoneNumber(
        auth,
        formatPhone,
        recaptchaVerifier
      );

      setConfirmationResult(newConfirmationResult);
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error("Failed to resend OTP. Please try again later.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      await confirmationResult.confirm(otp);
      setLoading(false);
      toast.success("OTP verified successfully!");
      // You can redirect to the next page here
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      setLoading(false);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="container">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      <div className="header">
        <h1>
          <span className="Admit">Admit</span>
          <span style={{ color: "black" }}>Kard</span>
        </h1>
      </div>
      <div className="mid-part">
        <h2>Please Verify your Mobile Number</h2>
        <span>An OTP is sent to {phoneNumber}</span>
      </div>
      <div className="content">
        <fieldset className="field">
          <legend>Enter OTP</legend>
          <div className="setting">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
            />
          </div>
        </fieldset>
        <div className="foot">
          <button
            onClick={handleVerifyOTP}
            className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
            disabled={loading}
          >
            {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
            <span>Verify OTP</span>
          </button>
          <div className="resend">
            <p>Did not receive the code?</p>
            <button
              onClick={handleResendCode}
              className="resend-button"
              disabled={loading}
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
