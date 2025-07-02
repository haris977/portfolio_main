import { div } from 'framer-motion/client';
import Image from 'next/image';
import {HoverBorderGradient} from '@/components/ui/BorderGradient'
import Rotatingword from './Rotatingword';
import { SiGmail } from "react-icons/si";
import { VscGithub } from "react-icons/vsc";  
import { FaWhatsapp } from "react-icons/fa";  
import { FaLinkedinIn } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { SiCodechef } from "react-icons/si";
import DownloadButton from './DownloadButton';

import { SiCodeforces } from "react-icons/si";
import { MdOutlineCloudDownload } from "react-icons/md";
import FallingStar from './ui/FallingStar';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import DownloadButtonUi from './DownloadButtonUi';
const Home = () => {
  return (
    <div className="relative min-h-screen bg-black w-full">
      {/* Neural Network Background */}
      <div className="absolute inset-0 z-5 w-full min-w-full">
        <NeuralNetworkBackground />
      </div>
      
      {/* Centered Falling Stars */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
        <FallingStar />
      </div>

  {/* Main Content */}
        <div className="relative z-20 pt-32 text-white flex justify-between items-center">
        <div className="flex flex-col items-start space-y-2 pt-7">
          <div className="font-bold text-5xl pt-7">Haris Manzar</div>
          <Rotatingword />
          <div className="flex space-x-3 py-5 text-3xl pt-7">
            <SiGmail className="hover:bg-red-400 rounded-md cursor-pointer" />
            <VscGithub className="rounded-md cursor-pointer" />
            <FaWhatsapp className="hover:bg-green-800 rounded-md cursor-pointer" />
            <FaLinkedinIn className="hover:bg-blue-800 rounded-md cursor-pointer" />
            <SiLeetcode className="hover:bg-amber-500 rounded-md cursor-pointer" />
            <SiCodeforces className="hover:bg-[rgb(46,55,18)] rounded-md cursor-pointer" />
            <SiCodechef className="hover:bg-amber-950 rounded-md cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-end">
          <Image
            src="/MY_best_pic_corp_copy-removebg-preview.png"
            alt="My Best Pic"
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Download Button */}
      <div className="relative z-20 flex justify-center items-center py-8">
        <DownloadButtonUi />
      </div>
</div>

    
  );
};
export default Home;