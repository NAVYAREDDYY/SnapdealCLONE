import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function VendorLogin() {
  const [identifier, setIdentifier] = useState("");
  const [stage, setStage] = useState('start'); // start -> methods -> password | otp
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authBase = "http://localhost:5000/authroutes";
  const otpBase = "http://localhost:5000/otproutes";

  const continueClick = () => setStage('methods');

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${otpBase}/send-otp`, { identifier });
      setStage('otp');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${otpBase}/login-otp`, { identifier, otp });
      if (res.data?.token && res.data?.user) {
        const userData = { ...res.data.user, token: res.data.token };
        dispatch(setUser(userData));
        localStorage.setItem("currentUser", JSON.stringify(userData));
        navigate('/vendor/dashboard');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'OTP verification failed');
    } finally { setLoading(false); }
  };

  const loginPassword = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${authBase}/login`, { identifier, password, mode: 'password' });
      if (res.data?.token && res.data?.user) {
        const userData = { ...res.data.user, token: res.data.token };
        dispatch(setUser(userData));
        localStorage.setItem("currentUser", JSON.stringify(userData));
        navigate('/vendor/dashboard');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 16 }}>
      <h2 className="text-2xl font-semibold" style={{ marginBottom: 12 }}>Vendor Login</h2>
      <input
        className="holder"
        type="text"
        value={identifier}
        onChange={(e)=>setIdentifier(e.target.value)}
        placeholder="Mobile Number (10 digits) or Email"
        required
      />
      {stage==='start' && (
        <button className="Continue-btn" style={{ marginTop: 12 }} onClick={continueClick} disabled={!identifier.trim()}>Continue</button>
      )}
      {stage==='methods' && (
        <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
          <button className="Continue-btn" onClick={sendOtp} disabled={loading}>Use OTP</button>
          <button className="Continue-btn" onClick={()=>setStage('password')}>Login with Password</button>
        </div>
      )}
      {stage==='password' && (
        <div style={{ marginTop: 12 }}>
          <input className="holder" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
          <button className="login-btn" style={{ marginTop: 8 }} onClick={loginPassword} disabled={loading || !password}>Login</button>
        </div>
      )}
      {stage==='otp' && (
        <div style={{ marginTop: 12 }}>
          <input className="otp-input" type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" />
          <button className="login-btn" style={{ marginTop: 8 }} onClick={verifyOtp} disabled={loading || !otp}>Verify & Login</button>
        </div>
      )}
    </div>
  );
}


