"use client";
import React from 'react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import SkillsBubblesFancy from './ui/SkillsCricle'; // <-- this is the file you posted
import { SparklesCore } from './ui/Sparcles';
const Skills = () => {
  return (
      
      <div className="relative bg-black p-10 z-10 flex flex-col items-center justify-center w-full">
        <div className='flex flex-col items-center'>

        <h2 className="text-4xl font-bold text-white">My Skills</h2>
        <div className="w-[40rem] h-40 bg-transparent absolute">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
 
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
      </div>
        {/* Bubble SVG container (already transparent in your code) */}
        <div className="w-full h-full z-30">
          <SkillsBubblesFancy />
        </div>
      </div>
  );
};

export default Skills;
