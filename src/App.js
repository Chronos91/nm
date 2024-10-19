import React from 'react';
import Login from './components/Login';
import image from './assets/images/screenshot.png';

function App() {
  return (
    <div className="App" style={{ position: "relative", height: "100vh", width: "100%" }}>
      
      {/* Background Image with Blur */}
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3px)", // Apply blur effect here
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Ensure the background stays behind the form
          height: "100vh",
          width: "100%",
        }}
      ></div>
      
      {/* Login Form */}
      <Login />
      
    </div>
  );
}

export default App;
