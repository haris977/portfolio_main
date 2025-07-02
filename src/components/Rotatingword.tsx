"use client"
import React from 'react'
import { useEffect,useState } from 'react'
  
const word = ["Programmer","Developer","Learner"];
const Rotatingword = () => {
  const [Index,setIndex] = useState(0);
  useEffect(()=>{
    const interval = setInterval(()=>{
      setIndex((prev) => (prev+1)%word.length);

    },1000);
    return ()=>clearInterval(interval);
  },[]);
  return (
    <div className="flex text-2xl">
  I am a {" "}
  <div className="space-x-2">
    <span className="rounded-md bg-gradient-to-r font-bold from-gray-700 to-gray-900 text-white transition-all duration-500">
      {`_${word[Index]}`}
    </span>
  </div>
</div>

 )
}

export default Rotatingword
