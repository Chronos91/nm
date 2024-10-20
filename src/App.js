import React, { useState, useEffect } from 'react';
import Login from './components/Login';

// Import different image sizes
import mobilePortrait from './assets/images/screenshot-mobile_portrait.jpg';
import mobileLandscape from './assets/images/screenshot-mobile_landscape.jpg';
import tabletPortrait from './assets/images/screenshot-tablet_portrait.jpg';
import tabletLandscape from './assets/images/screenshot-tablet_landscape.jpg';
import smallDesktop from './assets/images/screenshot-small_desktop.jpg';
import largeDesktop from './assets/images/screenshot-large_desktop.jpg';

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
        setObjectFitStyle('cover');    // Large screens use 'cover'
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
      
      {/* Responsive Background Image */}
      <img
        src={largeDesktop} // Fallback for older browsers
        srcSet={`
          ${mobilePortrait} 320w,
          ${mobileLandscape} 480w,
          ${tabletPortrait} 600w,
          ${tabletLandscape} 768w,
          ${smallDesktop} 1024w,
          ${largeDesktop} 1600w
        `}
        sizes="(max-width: 320px) 320px, 
               (max-width: 480px) 480px, 
               (max-width: 600px) 600px, 
               (max-width: 768px) 768px, 
               (max-width: 1024px) 1024px, 
               1600px" // Default size for large screens
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: objectFitStyle, // Dynamic objectFit based on screen size
          objectPosition: objectPositionStyle, // Dynamic objectPosition based on screen size
          zIndex: -1,
        }}
      />

      {/* Login Form */}
      <Login />
      
    </div>
  );
}

export default App;
