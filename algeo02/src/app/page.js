"use client";

import FileUpload from "@/components/FileUpload";
import ImageCard from "@/components/ImageCard";
import Image from "next/image";
import { useState } from "react";

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  return (
    <main>
      {/* Section 1 */}
      <div className="py-2 px-8 border-b-2 border-[#2f1952] bg-gradient-to-r from-[#6d28d9] to-[#9676f6]">
        <h1 className="text-2xl bg-gradient-te font-semibold">
          Reverse Image Search
        </h1>
      </div>
      <div className="flex flex-wrap justify-center">
        <div className="p-4">
          <h1 className="p-2">Image Input</h1>
          <FileUpload onFileUpload={handleFileUpload} />
          {uploadedFile && (
            <div className="p-2">
              <h2>Uploaded Image:</h2>
              <p>File name: {uploadedFile.name}</p>
              <p>File size: {uploadedFile.size} bytes</p>
            </div>
          )}
          <div className="flex flex-col m-2 p-4 items-center">
            <button className="py-2 px-16 text-xl rounded-full bg-gradient-to-r from-[#6d28d9] to-[#a78bfa] hover:opacity-80">
              Search
            </button>
          </div>
        </div>
      </div>
      {/* Section 2 */}
      <div className="p-4">
        <hr className="mx-28 border-[#6d28d9]" />
        {uploadedFile && (
          <div className="flex flex-wrap md:mx-60 sm:mx-32 my-10 gap-12 gap-y-6 justify-center">
            <ImageCard images="/images/0.jpg" />
            <ImageCard images="/images/1.jpg" />
            <ImageCard images="/images/2.jpg" />
            <ImageCard images="/images/3.jpg" />
            <ImageCard images="/images/4.jpg" />
            <ImageCard images="/images/5.jpg" />
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
