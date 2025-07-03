"use client";

import Image from "next/image";
import React from 'react';
import aboutmeimage from '@/../public/about_me_pic_2.jpg';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';

const AboutMe = () => {
  return (
    <div className="relative w-full pt-32 h-screen bg-black flex flex-col items-center min-w-full">
      {/* <div className="absolute inset-0 z-5 w-full min-w-full">
        <NeuralNetworkBackground />
      </div> */}

      <div className="relative z-10 flex w-full h-full items-center justify-around text-white space-x-3">
        <div className="text-4xl font-bold">
          About Me
        </div>

        <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-white shadow-[0_0_30px_10px_rgba(255,255,255,0.5)]">
          <Image
            src={aboutmeimage}
            alt="my about me picture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-end text-xl">
          <ul className="space-y-2">
            <li className="relative before:content-['✅']">Qualification: B.Tech from NIT Warangal</li>

            <li className="relative before:content-['✅']">
              Experience:
              <ul className="pl-6">
                <li className="relative before:content-['✨']">Internship in ONGC</li>
              </ul>
            </li>

            <li className="relative before:content-['✅']">
              Home:
              <ul className="pl-6">
                <li className="relative before:content-['🏡']">Patna, Bihar 800006</li>
              </ul>
            </li>

            <li className="relative before:content-['✅']">
              Achievement:
              <ul className="pl-6 space-y-1">
                <li className="relative before:content-['🥇']">JEE Main Rank 20K</li>
                <li className="relative before:content-['🥉']">3rd Runner-up in Inter-NIT Chess Tournament</li>
                <li className="relative before:content-['🥇']">Bihar Topper in Xth Class</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
