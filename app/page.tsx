"use client";

import ImageGenerator from "@/components/generator";

export default function Home() {
  return (
    <div className=" px-14 max-lg:px-8 max-md:px-2 py-4 h-screen">
      <div className="relative flex justify-center items-center h-[100%]">
        <div className="absolute w-[100%] top-0 bg-[#0a2463] h-48 rounded-tl-2xl rounded-tr-2xl bod">
          <h1 className="text-white p-12 pt-8 md:text-2xl max-sm:text-center">
            Create an Image with your Imagination
          </h1>
        </div>
        <div className="h-[85%] w-[75%] max-md:w-[90%] flex justify-center mt-20 border-2 bg-[#fff] border-zinc-200 rounded-2xl p-8 max-md:px-5 max-md:py-2 z-20">
          <ImageGenerator />
        </div>
      </div>
    </div>
  );
}
