"use client";
import React from 'react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import SkillsBubblesFancy from './ui/SkillsCricle'; // <-- this is the file you posted

const Skills = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden pt-12 p-10">
      {/* Background layer */}
      {/* <div className="absolute inset-0 z-0">
        <NeuralNetworkBackground />
      </div> */}

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full space-y-8">
        <h2 className="text-4xl font-bold text-white">My Skills</h2>

        {/* Bubble SVG container (already transparent in your code) */}
        <div className="w-full h-[80vh]">
          <SkillsBubblesFancy />
        </div>
      </div>
    </div>
  );
};

export default Skills;
