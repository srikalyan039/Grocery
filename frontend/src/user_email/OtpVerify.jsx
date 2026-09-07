import axios from "axios";
import React, { useState, useEffect } from "react";
import { emailUrl, userUrl } from "../repo/api_path";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const OtpVerify = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const storedEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName") || "User";

  const [email] = useState(storedEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storedEmail) {
      alert("Please request an OTP first");
      navigate("/send-otp");
    }
  }, [storedEmail, navigate]);

  const otphandler = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const targetUrl = userUrl || emailUrl;

      const res = await axios.post(`${targetUrl}/verify-otp`, {
        email,
        otp: otp.trim(),
      });

      console.log(res.data);
      alert("Verification successful");

      const token = res.data?.token || res.data?.userToken;
      const userObj = res.data?.user || {
        name: storedName,
        email: email,
      };

      login(userObj, token);

      // Clean up temporary email/name keys
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");

      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Wrong OTP or OTP expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emailSection">
      <div className="emailHeading verify">OTP Verification</div>
      <form onSubmit={otphandler} className="emailForm">
        <div style={{ color: "red", marginBottom: "10px" }}>
          OTP valid only for 5 minutes
        </div>

        <h3>Email</h3>
        <input type="email" value={email} readOnly />

        <h3>OTP</h3>
        <input
          type="text"
          value={otp}
          placeholder="Enter 6-digit OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default OtpVerify;