"use client"; 
import React from "react";
import Home from "./Home";
import AboutMe from "./AboutMe"; 
import Skills from "./Skills";
import MyProjects from "./MyProjects";
import { MyEducation } from "./MyEducation";

const Hero = () => {
  return (
    <div className="w-full">
      <Home />
      <AboutMe />
      <Skills/>
      <MyProjects/>
      <MyEducation/>
    </div>
  );
};

export default Hero;