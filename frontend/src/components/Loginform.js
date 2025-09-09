import { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    console.log("Sending data:", { emailOrMobile });
    try {
      const res = await axios.post("http://localhost:5000/otproutes/send-otp", {
        emailOrMobile
      });

      alert(res.data.message || "OTP sent successfully!");
      setShowOtp(true); 
      console.log("showOtp:", true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/otproutes/login-otp", {
        emailOrMobile,
        otp,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
        localStorage.setItem("username", res.data.user.username);

      }
      alert(res.data.message || "Login Successful!");
      setEmailOrMobile("");
      setOtp("");
      setShowOtp(false);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div>
      <form>
        <div>
          <div className="login-main-header">Login / Sign up on Snapdeal</div>
          <div className="login-subheader">
            Please provide your Mobile Number or Email to Login / Sign Up
          </div>
          <input
            className="holder"
            type="text"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            required
            placeholder="Mobile Number / Email"
          />
        </div>

        {!showOtp ? (
          <button type="button" className="Continue-btn" onClick={handleSendOtp}>
            CONTINUE
          </button>
        ) : (
          <>
            <div>
              <input
                className="otp-input"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
              />
            </div>
            <button type="button" className="login-btn" onClick={handleLogin}>
              Login
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
