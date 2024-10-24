// ErrorPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the timeout for redirection
    const timer = setTimeout(() => {
      // Replace this URL with the desired domain or path
      window.location.href = 'https://www.yourdomain.com'; // or use navigate('/path') for internal routing
    }, 2500); // Redirect after 5 seconds

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default ErrorPage;
