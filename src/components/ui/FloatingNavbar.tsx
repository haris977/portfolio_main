"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    // icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only use scroll progress on client side
  const { scrollYProgress } = useScroll();

  // Scroll spy functionality - only run on client
  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      const sections = navItems.map(item => item.link.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems, isClient]);

  // Only use motion value event on client side
  useEffect(() => {
    if (!isClient) return;
    
    const unsubscribe = scrollYProgress.on("change", (current) => {
      // Check if current is not undefined and is a number
      if (typeof current === "number") {
        let direction = current - scrollYProgress.getPrevious()!;

        if (scrollYProgress.get() < 0.05) {
          // also set true for the initial state
          setVisible(true);
        } else {
          if (direction < 0) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      }
    });

    return unsubscribe;
  }, [scrollYProgress, isClient]);

  // Don't render anything until client-side
  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-4 md:top-10 inset-x-0 mx-auto px-4 md:px-10 py-2 md:py-3 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-2 md:space-x-4",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(100%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "30px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        {navItems.map((navItem: any, idx: number) => {
          const isActive = activeSection === navItem.link.substring(1);
          return (
            <a
              key={`link=${idx}`}
              href={navItem.link}
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(navItem.link);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
              className={cn(
                "relative items-center flex space-x-1 transition-all duration-200 px-2 md:px-3 py-1 md:py-2 rounded-md",
                isActive 
                  ? "text-blue-400 bg-white/20" 
                  : "text-white hover:text-blue-400 hover:bg-white/10"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="text-xs md:text-sm !cursor-pointer font-medium">{navItem.name}</span>
            </a>
          );
        })}
        {/* remove this login btn */}
        {/* <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};
