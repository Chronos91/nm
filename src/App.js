import React, { useState, useEffect } from 'react';
import Login from './components/Login';

// Import the background image
import backgroundImage from './assets/images/background.png';

function App() {
  const [objectFitStyle, setObjectFitStyle] = useState('cover');
  const [objectPositionStyle, setObjectPositionStyle] = useState('center');

  useEffect(() => {
    // Function to check screen width and apply appropriate styles
    const updateStyles = () => {
      if (window.innerWidth <= 768) {
        setObjectFitStyle('contain');  // Small screens use 'contain'
        setObjectPositionStyle('center');  // Center the image on small screens
      } else {
        setObjectFitStyle('contain');    // Large screens use 'cover'
        setObjectPositionStyle('top'); // Start from the top on large screens
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
      
      {/* Background Image with Blur */}
      <img
        src={backgroundImage}
        alt="Background"
        style={{
          position: "absolute",
          top: "10px",
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: objectFitStyle, // Dynamic objectFit based on screen size
          objectPosition: objectPositionStyle, // Dynamic objectPosition based on screen size
          filter: "blur(5px)", // Add blur effect
          zIndex: -1,
        }}
      />

      {/* Login Form */}
      <Login style={{ marginTop: '100px' }} />
      
    </div>
  );
}

export default App;
