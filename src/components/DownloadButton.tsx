import { MdOutlineCloudDownload } from "react-icons/md";
import { HoverBorderGradient } from "@/components/ui/BorderGradient";

const DownloadCVButton = () => {
  return (
    <HoverBorderGradient
  // containerClassName="rounded-full"
  // as="a"
  // href="https://drive.google.com/uc?export=download&id=1gR3sqfvUUDYBPxJZME96_6xanMLt5sqK"
  // download
  // target="_blank"
  // rel="noopener noreferrer"
  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-4 py-2"
>
  <MdOutlineCloudDownload className="text-xl" />
  <span>DOWNLOAD CV</span>
</HoverBorderGradient>

  );
};

export default DownloadCVButton;
