import axios from "axios";
import React, { useState } from "react";
import { emailUrl, userUrl } from "../repo/api_path";
import { useNavigate } from "react-router-dom";

const SendOtp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const emailHandler = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedName || !trimmedEmail) {
      alert("Please enter both Name and Email");
      return;
    }

    try {
      setLoading(true);
      const targetUrl = userUrl || emailUrl;

      const res = await axios.post(`${targetUrl}/send-otp`, {
        name: trimmedName,
        email: trimmedEmail,
      });

      console.log("OTP Response:", res.data);
      alert("OTP sent to your email!");

      // Save user info for the verification screen
      localStorage.setItem("userEmail", trimmedEmail);
      localStorage.setItem("userName", trimmedName);

      // Navigate to OTP verification page
      navigate("/verify-otp");
    } catch (error) {
      console.error("Send OTP Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Failed to send OTP. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emailSection">
      <div className="emailHeading">
        *Please enter your Name and Email for OTP
      </div>

      <form onSubmit={emailHandler} className="emailForm">
        <h3>Name</h3>
        <input
          type="text"
          placeholder="Please enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        <h3>Email</h3>
        <input
          type="email"
          placeholder="Please enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default SendOtp;