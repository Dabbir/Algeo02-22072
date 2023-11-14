"use client";
import { useState } from "react";
import FileUpload from "../FileUpload";
import Pagination from "../Pagination";
import ImageCard from "../ImageCard";
import Gallery from "../Gallery";

const FileUploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Replace with your total number of pages
  const containerPage = "Home"; // Replace with your container page name

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Add logic to fetch data for the new page if needed
  };

  const handleFileUpload = (file) => {
    setTimeout(() => {
      setUploadedFile(file);
    }, 1000);
  };

  const handleCancelUpload = () => {
    setUploadedFile(null);
  };

  const handleReset = () => {
    setUploadedFile(null);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center pt-16">
        <div className="p-4 w-[70em]">
          <h1 className="p-2 font-bold text-2xl">Image Input</h1>
          <FileUpload
            onFileUpload={handleFileUpload}
            onCancelUpload={handleCancelUpload}
            onReset={handleReset}
          />
        </div>
      </div>
      {/* Section 2 */}
      <div className="p-4">
        <hr className="mx-28 border-secondary" />
        {uploadedFile && <Gallery folderPath="/public/images" />}
        <hr className="mx-28 border-secondary" />
        <div className="flex justify-center my-8">
          <button className="py-2 px-16 text-white text-xl rounded-full bg-gradient-to-r from-quaternary to-primary hover:opacity-80">
            Upload Dataset
          </button>
        </div>
      </div>
    </>
  );
};

export default FileUploadPage;
