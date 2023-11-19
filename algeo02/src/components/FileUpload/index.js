"use client";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import ToggleButton from "../ToggleButton";
import { useState, useEffect, useRef } from "react";

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const FileUpload = ({
  onFileUpload,
  onCancelUpload,
  onReset,
  onSearch,
  onToggle,
  onCamera,
}) => {
  const [uploading, setUploading] = useState(false);
  const [saveImage, setSaveImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [usingCamera, setUsingCamera] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [capturedImages, setCapturedImages] = useState([]);
  const [captureInterval, setCaptureInterval] = useState(null);
  const [latestCapture, setLatestCapture] = useState(null);

  const cameraVideoRef = useRef(null);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles[0]);
      onFileUpload(acceptedFiles[0]);
      setSaveImage(acceptedFiles[0]);
    },
  });

  const uploadedFile = acceptedFiles[0];

  const handleToggle = (activeButton) => {
    onToggle(activeButton);
    // setUsingCamera(activeButton === "camera");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }

      // Capture an image every 10 seconds
      const interval = setInterval(() => {
        captureImage();
      }, 10000);

      setCaptureInterval(interval);

      return () => {
        clearInterval(interval);
        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      clearInterval(captureInterval);
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const captureImage = async () => {
    if (cameraVideoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = cameraVideoRef.current.videoWidth;
      canvas.height = cameraVideoRef.current.videoHeight;
      context.drawImage(
        cameraVideoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imageDataURL = canvas.toDataURL("image/png");

      // Step 1: Send the new image to the server
      const blob = dataURLtoBlob(imageDataURL);
      const formData = new FormData();
      formData.append("photo", blob, "camera-photo.png");

      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Camera image uploaded successfully");
      } else {
        console.error("Camera image upload failed:", response.statusText);
      }

      setLatestCapture(imageDataURL);
    }
  };

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

  const handleIsCamera = () => {
    setUsingCamera(!usingCamera);
    onCamera(!usingCamera);
  };

  const handleUpload = async () => {
    if (usingCamera) {
      clearInterval(captureInterval);
    }

    setUploading(true);
    try {
      // Step 1: Delete the previous file on the server
      await fetch("http://localhost:4000/api/upload", {
        method: "DELETE",
      });

      let formData = new FormData();

      if (usingCamera) {
        const blob = dataURLtoBlob(latestCapture);
        formData.append("photo", blob, "camera-photo.png");
      } else if (uploadedFile) {
        formData.append("photo", uploadedFile);
      } else {
        alert("No image uploaded or captured from the camera");
        return;
      }

      // Step 2: Upload the new file
      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
      } else {
        console.error("File upload failed:", response.statusText);
      }

      setTimeout(() => {
        setUploading(false);
        onSearch();
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  useEffect(() => {
    let countdownValue = 10;
    let countdownInterval;

    const startCameraAndCountdown = async () => {
      await startCamera();

      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            captureImage();
            return 10;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    };

    if (usingCamera) {
      startCameraAndCountdown();
    }

    return () => {
      clearInterval(countdownInterval);
      if (usingCamera) {
        stopCamera();
      }
    };
  }, [usingCamera, cameraVideoRef]);

  return (
    <>
      <div className="flex flex-row gap-4 w-full h-[52vh]">
        <div className="relative border-2 border-tertiary bg-quinary bg-opacity-20 rounded-lg w-[50%]">
          {usingCamera && cameraStream && (
            <>
              <video
                id="cameraVideo"
                ref={cameraVideoRef}
                className="w-full h-full"
                autoPlay
                playsInline
              />
              <div className="absolute top-0 right-0 m-2">
                <p className="text-white bg-gray-800 p-2 rounded-full">
                  Countdown: {countdown}s
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4">
                {latestCapture && (
                  <>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="py-2 px-4 ml-4 bg-gradient-to-r from-quaternary to-primary text-white rounded-full hover:opacity-80"
                    >
                      Upload Latest Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="py-2 px-4 ml-4 bg-red-500 text-white rounded-full hover:opacity-80"
                    >
                      Stop Camera
                    </button>
                  </>
                )}
              </div>
            </>
          )}
          {!usingCamera && uploadedFile ? (
            <img
              src={URL.createObjectURL(uploadedFile)}
              alt={uploadedFile.path}
              className="absolute inset-0 object-contain w-full h-full"
            />
          ) : usingCamera ? null : (
            <div className="flex justify-center items-center rounded-lg w-full h-full">
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
            <input {...getInputProps()} id="fileInput" accept="image/*" />
            {!usingCamera && uploadedFile ? (
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
                <Image
                  src={usingCamera ? "/capture.png" : "/download.svg"}
                  width={50}
                  height={50}
                  alt="..."
                />
                <p className="text-gray-600">
                  {usingCamera
                    ? "Capturing image every 10 seconds..."
                    : "Drag and drop an image here, or click to select one"}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col p-4 items-center w-full h-[60%]">
            <div className="object-contain max-h-[8em]">
              {usingCamera && latestCapture && (
                <div className="mb-4">
                  <h5 className="text-lg font-semibold">Latest Capture:</h5>
                  <img
                    src={latestCapture}
                    alt="Latest Capture"
                    className="w-16 h-16 object-cover mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleIsCamera()}
                className={`${
                  usingCamera
                    ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
                    : "text-primary transform scale-100 transition-all"
                } px-4 py-2 rounded-full`}
              >
                Use Camera
              </button>
              <button
                onClick={() => handleIsCamera()}
                className={`${
                  !usingCamera
                    ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
                    : "text-primary transform scale-100 transition-all"
                } px-4 py-2 rounded-full`}
              >
                Upload Image
              </button>
            </div>
            {!usingCamera && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="py-2 px-16 w-full text-white text-xl rounded-full bg-gradient-to-r from-quaternary to-primary hover:opacity-80 mt-4"
              >
                Search
              </button>
            )}
            <ToggleButton onToggle={handleToggle} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
