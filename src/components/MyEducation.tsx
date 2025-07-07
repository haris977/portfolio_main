import React from "react";
import { Timeline } from "@/components/ui/TimeLine";
import Image from 'next/image';
import NitWarangal from '../../public/NITWarangal.jpg'
import classx from '../../public/islamia school (1).jpg';
import classxll from '../../public/patna_school.jpg'
export function MyEducation() {
  const data = [
    {
      title: "2021-2025",
      content: (
          <div className="flex flex-col flex-center items-center ">
            <div className="text-white flex flex-col items-center">
              <p>
                B.Tech in Chemical Engineering
              </p>
              <p >
                National Institute of Technology, Warangal
              </p>
              <p className="">
                CGPA: 7.06
              </p>

            </div>
            <Image
                  src={NitWarangal}
                  alt="startup template"
                  width={500}
                  height={500}
                  className="flex flex-center border rounded-2xl"
                />
          </div>
        
      ),
    },
    {
      title: "2018-2019",
      content: (
          <div className="flex flex-col flex-center items-center h-1/3">
            <div className="text-white flex flex-col items-center">
              <p>
                Intermediate (Class 12th), PCM Stream
              </p>
              <p >
                Patna High School +2 Patna, Bihar
              </p>
              <p className="">
                Percentage: 81.6%
              </p>

            </div>
            <Image
                  src={classxll}
                  alt="startup template"
                  width={500}
                  height={500}
                  className="flex flex-center border rounded-2xl"
                />
          </div>
        
      ),
    },
    {
      title: "2016-2017",
      content: (
          <div className="flex flex-col flex-center items-center h-1/3">
            <div className="text-white flex flex-col items-center">
              <p>
                High School (Class 10th)
              </p>
              <p >
                MBTA High School +2 Katihar, Bihar 
              </p>
              <p className="">
                Percentage: 71%
              </p>

            </div>
            <Image
                  src={classx}
                  alt="startup template"
                  width={500}
                  height={500}
                  className="flex flex-center border rounded-2xl"
                />
          </div>
        
      ),
    },
  ];
  return (
    <div id="education" className="relative bg-black w-full overflow-clip pt-0">
      <Timeline data={data} />
    </div>
  );
}
