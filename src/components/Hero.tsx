// FRONTEND/src/components/Hero.tsx
"use client"; // IMPORTANT: If Home or DownloadButtonUi also have client-side logic, this should already be here.
              // If not, adding it now ensures AboutMe (which needs it) functions correctly.

import React from "react";
import Home from "./Home";
import AboutMe from "./AboutMe"; // Your AboutMe component now includes its own background

const Hero = () => {
  return (
    <div className="w-full">
      {/* Home Section with background */}
      <div className="relative w-full">
        <Home />
      </div>

      {/* About Me Section - Will have the Neural Network Background */}
      {/* The AboutMe component now contains the background internally */}
      <AboutMe />
    </div>
  );
};

export default Hero;