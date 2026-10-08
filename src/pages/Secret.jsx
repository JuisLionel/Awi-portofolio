import { MdSkipNext, MdSkipPrevious, MdPause } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";

import { Link } from "react-router";

export default function Secrets() {


  return (
    <div className="flex relative min-h-screen w-full items-center justify-center gap-30 bg-black text-white">
      <Link to="/" className="flex absolute h-20 items-center gap-2 top-10 left-10 hover:top-8 hover:text-lime transition-all duration-200">
        <IoIosArrowBack size={30} />
        <h1 className="text-2xl font-sans">Home</h1>
      </Link>

      <div className="flex flex-col items-center gap-6">
        <h1 className="font-title text-[200px] text-lime">Coming Soon</h1>
      </div>
    </div>
  );
}