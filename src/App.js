import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import ErrorPage from './ErrorPage';

// Import the background image
import backgroundImage from './assets/images/background.png';

function App() {
  const [objectFitStyle, setObjectFitStyle] = useState('cover');
  const [objectPositionStyle, setObjectPositionStyle] = useState('center');

  // Get the current location to conditionally hide the background on the error page
  const location = useLocation();

  useEffect(() => {
    // Function to check screen width and apply appropriate styles
    const updateStyles = () => {
      if (window.innerWidth <= 768) {
        setObjectFitStyle('contain');  // Small screens use 'contain'
        setObjectPositionStyle('center');  // Center the image on small screens
      } else {
        setObjectFitStyle('contain');    // Large screens also use 'contain'
        setObjectPositionStyle('center');  // Keep the image centered on large screens
      }
    };

    // Initial check
    updateStyles();

    // Add event listener for window resize
    window.addEventListener('resize', updateStyles);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateStyles);
    };
  }, []);

  return (
    <div className="App" style={{ position: "relative", height: "100vh", width: "100%" }}>
      
      {/* Conditionally render background image only if it's not the error page */}
      {location.pathname !== '/error' && (
        <img
          src={backgroundImage}
          alt="Background"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",  // Make sure the image takes full height
            objectFit: objectFitStyle,  // Use 'contain' for full visibility of the image
            objectPosition: objectPositionStyle,  // Center the image
            filter: "blur(5px)", // Add blur effect
            zIndex: -1,
          }}
        />
      )}

      {/* Routes for different pages */}
      <Routes>
        <Route path="/" element={<Login style={{ marginTop: '100px' }} />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
      
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
