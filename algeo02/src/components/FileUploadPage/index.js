"use client";
import { useState } from "react";
import FileUpload from "../FileUpload";
import Gallery from "../GalleryDataset";
import ButtonUpload from "../ButtonUpload";
import GallerySimilar from "../GallerySimilar";

const FileUploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [isUploadDataset, setIsUploadDataset] = useState(false);
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);
  const [searchTypeStatus, setSearchTypeStatus] = useState("");
  const [activeButton, setActiveButton] = useState("color");

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setShowGallery(false);
  };

  const handleCancelUpload = () => {
    setUploadedFile(null);
    setShowGallery(false);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setShowGallery(false);
  };

  const handleSearch = () => {
    setShowGallery(true);
    setIsDatasetUploaded(false);
  };

  const handleDatasetUpload = () => {
    setIsUploadDataset(true);
  };

  const handleToggle = (activeButton) => {
    setActiveButton(activeButton);
    setSearchTypeStatus(activeButton);
    console.log("Active Button in Parent Component:", activeButton);
  };

  return (
    <>
      {isUploadDataset && (
        <div className="absolute z-50 h-screen w-screen sm:px-8 md:px-16 sm:py-8">
          <div className="relative mx-auto my-[15vh] rounded-xl">
            <ButtonUpload
              onCancelUplaod={() => setIsUploadDataset(false)}
              onUploaded={() => setIsDatasetUploaded(true)}
            />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center pt-16">
        <div className="p-4 w-[70em]">
          <h1 className="p-2 font-bold text-2xl">Image Input</h1>
          <FileUpload
            onFileUpload={handleFileUpload}
            onCancelUpload={handleCancelUpload}
            onReset={handleReset}
            onSearch={handleSearch}
            onToggle={handleToggle}
          />
        </div>
      </div>
      {/* Section 2 */}
      <div className="p-4">
        <hr className="mx-28 border-secondary" />
        {showGallery && uploadedFile && (
          <GallerySimilar
            statusSearch={searchTypeStatus}
            activeButton={activeButton}
          />
        )}
        {isDatasetUploaded && !isUploadDataset && (
          <Gallery folderPath="/../backend/api/public/dataset" />
        )}
        <hr className="mx-28 border-secondary" />
        <div className="flex justify-center my-8">
          <button
            onClick={handleDatasetUpload}
            className="py-2 px-16 text-white text-xl rounded-full bg-gradient-to-r from-quaternary to-primary hover:opacity-80"
          >
            Upload Dataset
          </button>
        </div>
      </div>
    </>
  );
};

export default FileUploadPage;
