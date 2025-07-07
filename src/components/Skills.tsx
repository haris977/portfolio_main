"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { SparklesCore } from './ui/Sparcles';
import SkillsBubblesFancy from './ui/SkillsCricle';

const Skills = () => {
  const skills = [
    { name: "C++", level: 85, color: "from-blue-500 to-cyan-500" },
    { name: "Python", level: 75, color: "from-yellow-500 to-orange-500" },
    { name: "JavaScript", level: 80, color: "from-yellow-400 to-yellow-600" },
    { name: "React.js", level: 78, color: "from-cyan-500 to-blue-500" },
    { name: "Next.js", level: 70, color: "from-gray-700 to-gray-900" },
    { name: "Node.js", level: 75, color: "from-green-500 to-green-700" },
    { name: "Express.js", level: 72, color: "from-gray-600 to-gray-800" },
    { name: "MongoDB", level: 70, color: "from-green-400 to-green-600" },
    { name: "MySQL", level: 75, color: "from-blue-600 to-blue-800" },
    { name: "HTML", level: 85, color: "from-orange-500 to-red-500" },
    { name: "CSS", level: 80, color: "from-blue-500 to-purple-500" },
    { name: "Tailwind", level: 85, color: "from-cyan-400 to-blue-500" },
    { name: "Problem Solving", level: 88, color: "from-purple-500 to-pink-500" },
    { name: "OOPs", level: 82, color: "from-indigo-500 to-purple-500" },
    { name: "DBMS", level: 78, color: "from-blue-600 to-indigo-600" },
    { name: "Time Management", level: 85, color: "from-green-500 to-emerald-500" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div id="skills" className="relative bg-black p-6 md:p-10 pt-20 z-10 flex flex-col items-center justify-center w-full min-h-screen">


      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            My Skills
          </h2>
        </motion.div>

        {/* Sparkles right below "My Skills" - bubbles will flow through this */}
        <div className="relative z-10 mx-auto w-full max-w-xl h-40 px-4">
  {/* Gradient lines */}
  <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] blur-sm" />
  <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px" />
  <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] blur-sm" />
  <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />

  <SparklesCore
    background="transparent"
    minSize={0.4}
    maxSize={1}
    particleDensity={1200}
    className="w-full h-full flex absolute"
    particleColor="#FFFFFF"
  />

  <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
</div>


        {/* Mobile Skills Grid - Only show on small screens */}
        <div className="block lg:hidden">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 md:p-6 hover:border-gray-600/50 transition-all duration-300">
                  {/* Skill Name */}
                  <h3 className="text-white font-semibold text-sm md:text-base mb-3 text-center">
                    {skill.name}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700/50 rounded-full h-2 md:h-3 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                  
                  {/* Percentage */}
                  <p className="text-gray-300 text-xs md:text-sm text-center">
                    {skill.level}%
                  </p>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Bubbles - Only show on large screens */}
        <div className="hidden lg:block w-full h-[80vh] relative z-20 -mt-20">
          <SkillsBubblesFancy />
        </div>

        {/* Additional Skills Section - Only show on small screens */}
        <div className="block lg:hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Other Tools & Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                "Cloudinary", "Mongoose", "MS Excel", "MS PowerPoint", 
                "OS", "Adaptability", "Git", "REST APIs", "JWT", "Razorpay"
              ].map((tool, index) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-300 text-sm md:text-base hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
