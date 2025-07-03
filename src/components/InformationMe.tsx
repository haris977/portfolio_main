"use client"
import React from 'react'
import { FloatingDock } from './ui/FloatingDock';
import { SiGmail } from "react-icons/si";
import { VscGithub } from "react-icons/vsc";  
import { FaWhatsapp } from "react-icons/fa";  
import { FaLinkedinIn } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { SiCodechef } from "react-icons/si";
import { SiCodeforces } from "react-icons/si";
export function FloatingDockDemo() {
  const links = [
    {
      title: "Gmail",
      icon: (
        <SiGmail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
 
    {
      title: "Linkdin",
      icon: (
        <FaLinkedinIn className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Whatsapp",
      icon: (
        <FaWhatsapp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <VscGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
 
    {
      title: "Leetcode",
      icon: (
        <SiLeetcode className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Code Forces",
      icon: (
        <SiCodeforces className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Code Chef",
      icon: (
        <SiCodechef
        />
      ),
      href: "#",
    },
  ];
  return (
    <>
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
        />

        </>
  );
}



{/* <SiGmail className="hover:bg-red-400 rounded-md cursor-pointer" />
            <VscGithub className="rounded-md cursor-pointer" />
            <FaWhatsapp className="hover:bg-green-800 rounded-md cursor-pointer" />
            <FaLinkedinIn className="hover:bg-blue-800 rounded-md cursor-pointer" />
            <SiLeetcode className="hover:bg-amber-500 rounded-md cursor-pointer" />
            <SiCodeforces className="hover:bg-[rgb(46,55,18)] rounded-md cursor-pointer" />
            <SiCodechef className="hover:bg-amber-950 rounded-md cursor-pointer" /> */}