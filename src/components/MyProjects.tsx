"use client";
import React, { ReactNode, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import studynotion from '../../public/studynotion2.png';
import votingapp from '../../public/voting_app.jpg';
import pizzarunner from '../../public/pizza_runner_5.png';
import AIImageAnalyzer from '../../public/AI_Image_Analizer.png'
import { PinContainer } from '@/components/ui/3DPin';
type Project = {
  title: string;
  image: StaticImageData;
  details: ReactNode;
};

const MyProjects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div id="projects" className='flex flex-col bg-black p-10 pt-20 items-center relative'>

      <h2 className='font-bold text-white text-2xl md:text-3xl'>Project</h2>
      <h2 className='text-white text-base md:text-xl pb-10 text-center'>(for more exciting project plz. visit my GitHub)</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        <div className='pb-10'>
          <PinContainer title="StudyNotion" href="#">
            <div
              onClick={() =>
                setSelectedProject({
                  title: "StudyNotion",
                  image: studynotion,
                  details: (
                    <div className="space-y-2">
                      <p>– Developed a full-stack website for creating and buying courses.</p>
                      <p>– Implemented sign-up and login functionalities using JWT tokens and cookies.</p>
                      <p>– Used Cloudinary for image and video uploads. Integrated Razorpay for payment.</p>
                      <p>
                        – Tech stack: MERN, Tailwind, Cloudinary, MongoDB Atlas, Mongoose, Razorpay.
                      </p>
                      <p>
                        –{" "}
                        <a
                          href="https://github.com/haris977/study_notion"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Project GitHub Link
                        </a>
                      </p>
                      <p>
                        –{" "}
                        <a
                          href="https://studynotion-r9xx.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                          onClick={(e) => e.stopPropagation()} // 👈 IMPORTANT
                        >
                          Project Link
                        </a>
                      </p>

                    </div>
                  ),
                })
              }
              className="flex cursor-pointer flex-col tracking-tight text-slate-100/50 w-[20rem] h-[20rem]"
            >

              <h3 className="font-bold text-base text-slate-100 mb-1">StudyNotion</h3>
              <p className="text-slate-500 mb-2 text-sm">Platform where teachers help students.</p>
              <Image src={studynotion} alt='StudyNotion' className='rounded-xl' />
            </div>
          </PinContainer>
        </div>
        <div className='pb-10'>
          <PinContainer title="Voting App" href="#">
            <div
              onClick={() =>
                setSelectedProject({
                  title: "Voting App",
                  image: votingapp,
                  details: (
                    <div className="space-y-2">
                      <p>– Developed a secure voting backend system and integrated a robust REST API.</p>
                      <p>
                        – Aadhar-based authentication (JWT) with password security and duplicate vote
                        protection.
                      </p>
                      <p>– Tech Stack: Node.js, Express.js, MongoDB</p>
                      <p>
                        –{" "}
                        <a
                          href="https://github.com/haris977/Secure-Voting-System"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Project GitHub Link
                        </a>
                      </p>
                    </div>
                  ),
                })
              }
              className="flex pb-10 cursor-pointer flex-col tracking-tight text-slate-100/50 w-[20rem] h-[20rem]"
            >

              <h3 className="font-bold text-base text-slate-100 mb-1">Voting App</h3>
              <p className="text-slate-500 mb-2 text-sm">You can vote via internet.</p>
              <Image src={votingapp} alt='Voting App' className='rounded-xl' />
            </div>
          </PinContainer>
        </div>
        <div className='pb-10'>
          <PinContainer title="Pizza Store Analysis" href="#">
            <div
              onClick={() =>
                setSelectedProject({
                  title: "Pizza Store Analysis",
                  image: pizzarunner,
                  details: (
                    <div className="space-y-2">
                      <p>
                        – Analyzed ER diagrams and used advanced SQL (CASE, ALTER) for data cleaning.
                      </p>
                      <p>
                        – Optimized store performance: sales, delivery time, and ingredient use.
                      </p>
                      <p>– Tech Stack: MySQL Workbench</p>
                      <p>
                        –{" "}
                        <a
                          href="https://onedrive.live.com/view.aspx?resid=E38FEB9C024EB577!sc96662057fd446209092adbb8fd18cf1&redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvYy9lMzhmZWI5YzAyNGViNTc3L0VRVmlac25VZnlCR2tKS3R1NF9SalBFQjU3aWFTOXlQeUtqMFlOVDhJWmZSdVE_ZT15dHhIbnQ"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Project Link
                        </a>
                      </p>
                    </div>
                  ),
                })
              }
              className="flex pb-10 cursor-pointer flex-col tracking-tight text-slate-100/50 w-[20rem] h-[20rem]"
            >

              <h3 className="font-bold text-base text-slate-100 mb-1">Pizza Runner</h3>
              <p className="text-slate-500 mb-2 text-sm">Restaurant where you can order pizza.</p>
              <Image src={pizzarunner} alt='Pizza Runner' className='rounded-xl' />
            </div>
          </PinContainer>
        </div>
        <div className='pb-10'>
          <PinContainer title="AI Image Analyzer" href="#">
            <div 
              onClick={() =>
                setSelectedProject({
                  title: "AI Image Analyzer",
                  image: AIImageAnalyzer,
                  details: (
                    <div className="space-y-2">
                      <p>– Built an AI-powered Image Analyzer using Google Gemini API.</p>
                      <p>– Integrated Next.js frontend with Node.js + Express backend.</p>
                      <p>– Tech Stack: Next.js, Node.js, Express.js, Gemini API</p>
                      <p>
                        –{" "}
                        <a
                          href="https://github.com/haris977/image_analyzer"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Project GitHub Link
                        </a>
                      </p>
                    </div>
                  ),
                })
              }
              className="flex cursor-pointer flex-col tracking-tight text-slate-100/50 w-[20rem] h-[20rem]"
            >

              <h3 className="font-bold text-base text-slate-100 mb-1">AI Image Analyzer</h3>
              <p className="text-slate-500 mb-2 text-sm">A platform where you can Analyze your subject of intrest image</p>
              <Image src={AIImageAnalyzer} alt='AI Image Analyzer' className='rounded-xl' />
            </div>
          </PinContainer>
        </div>
      </div>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[90%] max-w-lg rounded-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{selectedProject.title}</h3>
            <Image
              src={selectedProject.image}
              alt={selectedProject.title}
              className="rounded-lg mb-4 w-full max-h-48 object-contain"
            />
            <div className="text-gray-700 text-sm">
              {selectedProject.details}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
