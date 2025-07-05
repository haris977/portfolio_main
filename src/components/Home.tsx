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
import { SiCodeforces } from "react-icons/si";
import DownloadButton from './DownloadButton';
import { MdOutlineCloudDownload } from "react-icons/md";
import FallingStar from './ui/FallingStar';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import DownloadButtonUi from './DownloadButtonUi';
import { FloatingDockDemo } from './InformationMe';
import BubbleContact from './ui/BubbleContact'
const Home = () => {
  return (
    <div className="relative min-h-full bg-black w-full">
      
      {/* Neural Network Background */}
      {/* <div className="absolute inset-0 z-5 w-full min-w-full">
        <NeuralNetworkBackground />
      </div> */}
      {/* Centered Falling Stars */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
        <FallingStar />
      </div>
  {/* Main Content */}
        <div className="relative z-20 pt-48 text-white flex justify-between px-20 items-center">
        <div className="flex flex-col items-start space-y-2 pt-7">
          <div className="font-bold text-5xl pt-7">Haris Manzar</div>
          <Rotatingword />
          <div className="flex space-x-3 py-5 pt-10 text-3xl ">
            <FloatingDockDemo/>
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
      
    <div className="relative z-20 flex justify-center items-center py-8">
      <DownloadButtonUi />
    </div>
  

  {/* ✅ Your hoho fixed floating div — outside layout */}
  <div className="relative min-h-full bg-black w-full">
    {/* ...your main content here... */}
    
    {/* ✅ Floating contact bubble */}
    <BubbleContact />
  </div>
      {/* Download Button */}
      </div>
     

    
  );
};
export default Home;