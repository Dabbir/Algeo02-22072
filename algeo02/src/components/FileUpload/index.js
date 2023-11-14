import Image from "next/image";
import { useDropzone } from "react-dropzone";
import ToggleButton from "../ToggleButton";
import { useState } from "react";

const FileUpload = ({ onFileUpload, onCancelUpload, onReset }) => {
  const [uploading, setUploading] = useState(false);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFileUpload(acceptedFiles[0]);
    },
  });

  const uploadedFile = acceptedFiles[0];

  const cancelUpload = () => {
    onCancelUpload();
  };

  const resetUpload = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }

    onReset();
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!uploadedFile) return;
      const formData = new FormData();
      formData.append("myImage", uploadedFile);
      const { data } = await axios.post("api/image", formData);
      console.log(data);
    } catch (error) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  return (
    <>
      <div className="flex flex-row gap-4 w-full h-[52vh]">
        <div className="relative border-2 border-tertiary rounded-lg w-[50%]">
          {uploadedFile ? (
            <img
              src={URL.createObjectURL(uploadedFile)}
              alt={uploadedFile.path}
              className="absolute inset-0 object-contain w-full h-full"
            />
          ) : (
            <div className="flex justify-center items-center rounded-lg bg-quaternary bg-opacity-30 w-full h-full">
              <Image
                src="image-preview.svg"
                alt="..."
                width={60}
                height={60}
                className="opacity-60"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col w-[50%]">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-tertiary rounded-lg m-2 p-6 w-full h-[40%] text-center cursor-pointer overflow-hidden relative"
          >
            <input {...getInputProps()} id="fileInput" />
            {uploadedFile ? (
              <div className="mt-4">
                <h5 className="text-lg font-semibold">Uploaded Image:</h5>
                <ul className="list-disc list-inside">
                  <li className="text-gray-700">
                    {uploadedFile.path} - {uploadedFile.size} bytes
                  </li>
                </ul>
                <div className="flex justify-center mt-4">
                  <button
                    className="py-2 px-4 mr-2 bg-red-500 text-white rounded-full hover:opacity-80"
                    onClick={cancelUpload}
                  >
                    Cancel Upload
                  </button>
                  <button
                    className="py-2 px-4 bg-gray-500 text-white rounded-full hover:opacity-80"
                    onClick={resetUpload}
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <Image src="/download.svg" width={50} height={50} alt="..." />
                <p className="text-gray-600">
                  Drag and drop an image here, or click to select one
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col p-4 items-center w-full h-[60%]">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="py-2 px-16 w-full text-white text-xl rounded-full bg-gradient-to-r from-quaternary to-primary hover:opacity-80 mb-4"
            >
              Search
            </button>
            <ToggleButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
