import React, { useState } from "react"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase-config";
import { useNavigate } from "react-router-dom"; 
import "../styles/Login.css";
import vitatrackLogo from '../assets/vitatrack.png';
import { useTheme } from '../context/DarkModeContext';

const Login = () => {
  const navigate = useNavigate(); 
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState(null); // State variable for error message
  const { isDarkMode, toggleDarkMode } = useTheme();

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;
      console.log("User logged in:", user.uid);

      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(user));

      navigate('/landing'); // Redirect to /landing after successful login
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message); // Set error message state
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="login-card">
        <div className="login-logo">
          <img src={vitatrackLogo} alt="Vitatrack Logo" className="vitatrack-logo" />
        </div>
        <h5 className="login-title">Sign into your account</h5>
        <input className="login-input" type="email" placeholder="Email address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
        <input className="login-input" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button className="login-btn" onClick={login}>Login</button>
        {error && <div className="login-error">{error}</div>} {/* Render error message div */}
        <a className="login-forgot-password" href="/forgotpassword">Forgot password?</a>
        <p className="login-register">Don't have an account? <span className="register-link" onClick={() => navigate('/register')}>Register here</span></p>
      </div>
    </div>
  );
}

export default Login;
