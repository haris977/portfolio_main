// Removed unused import
import Image from 'next/image';
import Rotatingword from './Rotatingword';
import FallingStar from './ui/FallingStar';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import DownloadButtonUi from './DownloadButtonUi';
import { FloatingDockDemo } from './InformationMe';
import BubbleContact from './ui/BubbleContact'
const Home = () => {
  return (
    <div id="home" className="relative min-h-screen bg-black w-screen">
      
      <div className="absolute inset-0 z-5 w-full min-w-full">
        <NeuralNetworkBackground />
      </div>
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
        <FallingStar />
      </div>
        <div className="relative z-20 pt-32 md:pt-48 text-white flex flex-col md:flex-row justify-between px-6 md:px-20 items-center gap-8 md:gap-0">
        <div className="flex flex-col items-center md:items-start space-y-2 pt-7 text-center md:text-left">
          <div className="font-bold text-3xl md:text-5xl pt-7">Haris Manzar</div>
          <Rotatingword />
          <div className="flex space-x-3 py-5 pt-10 text-xl md:text-3xl">
            <FloatingDockDemo/>
          </div>
        </div>

        <div className="w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_0_30px_10px_rgba(255,255,255,0.5)]">
          <Image
            src="/MY_best_pic_corp_copy-removebg-preview.png"
            alt="My Best Pic"
            width={250}
            height={250}
            className="rounded-full w-48 h-48 md:w-72 md:h-72"
          />
        </div>
      </div>
      
    <div className="relative z-20 flex justify-center items-center py-8">
      <DownloadButtonUi />
    </div>
  

  <div className="relative min-h-full bg-black w-full">
    
    <BubbleContact />
  </div>
      </div>
     

    
  );
};
export default Home;