"use client"
import React from 'react'
import Image from 'next/image';
import studynotion from '../../public/studynotion2.png'
import votingapp from '../../public/voting_app.jpg'
import pizzarunner from '../../public/pizza_runner_5.png';
import passwordmanager from '../../public/passopmanager.png'
import {PinContainer} from '@/components/ui/3DPin'
const MyProjects = () => {
  return (
    <div className='flex flex-col  bg-black p-10 items-center'>
        <h2 className='font-bold text-white text-3xl'>Project</h2>
        <h2 className='text-white text-xl pb-10'>(for more exciting project plz. visit my GitHub)</h2>
    <div className='flex justify-between pb-20'>
      <PinContainer
        title="StudyNotion"
        href="https://twitter.com/mannupaaji"
        >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            StudyNotion
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Platfrom where teacher help the students.
            </span>
          </div>
          <Image
            src={studynotion}
            alt='this is study notion'
            className='rounded-xl'
          />

          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" /> */}
        </div>
      </PinContainer>
      <PinContainer
        title="Voting App "
        href="https://twitter.com/mannupaaji"
        >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Voting App 
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              You can vote via internet.
            </span>
          </div>
          <Image
            src={votingapp}
            alt='this is voting app'
            className='rounded-xl'
          />
          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" /> */}
        </div>
      </PinContainer>
        </div>
        <div className='flex'>
          <PinContainer
        title="/Pizza Runner"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Pizza Runner
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              restaurant where you can order pizza
            </span>
          </div>
          <Image
          src={pizzarunner}
          alt='the is pizze store'
          className='rounded-xl'
          />
          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" /> */}
        </div>
      </PinContainer>
      <PinContainer
        title="PassWord Manger"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Password Manger
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Platfrom where you can store your passwords.
            </span>
          </div>
          <Image
          src={passwordmanager}
          alt='this is password manager'
          className='rounded-xl'
          />
          {/* <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" /> */}
        </div>
      </PinContainer>
        </div>
    </div>
  )
}

export default MyProjects
