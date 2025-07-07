"use client";
import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import studynotion from '../../public/studynotion2.png';
import votingapp from '../../public/voting_app.jpg';
import pizzarunner from '../../public/pizza_runner_5.png';
import passwordmanager from '../../public/passopmanager2.png';
import { PinContainer } from '@/components/ui/3DPin';
import { MaskContainer } from '@/components/ui/MaskEffect'
type Project = {
  title: string;
  image: StaticImageData;
  details: string;
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
                  details: `– Developed a full-stack website for creating and buying courses.\n– Implemented sign-up and login functionalities using JWT tokens and cookies.\n– Used Cloudinary for image and video uploads. Integrated Razorpay for payment.\n– Tech stack: MERN, Tailwind, Cloudinary, MongoDB Atlas, Mongoose, Razorpay.\n– [Project Link](https://studynotion-r9xx.vercel.app/)`
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
                  details: `– Developed a secure voting backend system and integrated a robust REST API.\n– Aadhar-based authentication (JWT) with password security and duplicate vote protection.\n– Tech Stack: Node.js, Express.js, MongoDB`
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
          {/* Second row */}
          <PinContainer title="Pizza Store Analysis" href="#">
            <div
              onClick={() =>
                setSelectedProject({
                  title: "Pizza Store Analysis",
                  image: pizzarunner,
                  details: `– Analyzed ER diagrams and used advanced SQL (CASE, ALTER) for data cleaning.\n– Optimized store performance: sales, delivery time, and ingredient use.\n– Tech Stack: MySQL Workbench`
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
          <PinContainer title="Password Manager" href="#">
            <div
              onClick={() =>
                setSelectedProject({
                  title: "Password Manager",
                  image: passwordmanager,
                  details: `– Developed a secure and user-friendly password management app using the MERN stack.\n– Core features: create, edit, delete, and save user profiles.\n– Tech Stack: HTML, Tailwind, CSS, React.js, MongoDB`
                })
              }
              className="flex cursor-pointer flex-col tracking-tight text-slate-100/50 w-[20rem] h-[20rem]"
            >
              <h3 className="font-bold text-base text-slate-100 mb-1">Password Manager</h3>
              <p className="text-slate-500 mb-2 text-sm">Platform where you can store your passwords.</p>
              <Image src={passwordmanager} alt='Password Manager' className='rounded-xl' />
            </div>
          </PinContainer>
        </div>
      </div>
      {/* Modal */}
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
            {selectedProject.details.split('\n').map((line, i) => (
              <p key={i} className="text-gray-700 text-sm mb-2">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
