import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import Image from "next/image";

const UploadFolder = ({ onCancelUpload, onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const zipFiles = newFiles.filter(
        (file) => file.type === "application/zip"
      );

      if (zipFiles.length > 0) {
        try {
          const zip = new JSZip();

          // Process each zip file
          await Promise.all(
            zipFiles.map(async (zipFile) => {
              const zipContents = await zip.loadAsync(zipFile);

              // Extract each file from the zip
              Object.keys(zipContents.files).forEach(async (filename) => {
                const content = await zipContents.files[filename].async("blob");
                const reader = new FileReader();

                reader.onload = function () {
                  const extractedFile = new File([reader.result], filename, {
                    type: zipContents.files[filename].comment || "",
                  });

                  // Add the extracted file to the state
                  setFiles((prevFiles) => [...prevFiles, extractedFile]);
                };

                reader.readAsArrayBuffer(content);
              });
            })
          );
        } catch (error) {
          console.error("Error extracting zip file:", error);
        }
      }
    },
    [files]
  );

  const handleFileDelete = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const cancelUpload = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancelUpload();
    }, 300);
  };

  const handleSaveUpload = async () => {
    try {
      if (!files || files.length === 0) {
        alert("No file uploaded");
      } else {
        await fetch("http://localhost:4000/api/upload/dataset", {
          method: "DELETE",
        });

        const formData = new FormData();

        // Flatten the array of files
        const flattenedFiles = files.reduce((acc, file) => {
          if (file instanceof FileList) {
            acc.push(...Array.from(file));
          } else {
            acc.push(file);
          }
          return acc;
        }, []);

        for (const file of flattenedFiles) {
          formData.append("files", file);
        }

        const response = await fetch(
          "http://localhost:4000/api/upload/dataset",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          cancelUpload();
          onUploaded();
          alert("Files uploaded successfully:");
        } else {
          console.error("Upload failed:", data.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      className={`transition-all transform duration-500 ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-0 translate-y-full"
      }`}
    >
      <div className="container mx-auto max-w-screen-lg mt-8">
        <div className="bg-quinary p-8 rounded-md">
          <label
            htmlFor="file-input"
            className="block text-lg font-semibold mb-4"
          >
            Upload Files
          </label>

          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <div className="border-dashed border-2 rounded-md border-gray-500 p-8 mb-8">
              <label
                htmlFor="file-input"
                className="cursor-pointer block text-gray-600 text-center p-4 border border-dashed border-gray-500 rounded-md"
              >
                <Image
                  src="/download.svg"
                  width={50}
                  height={50}
                  alt="..."
                  className="mx-auto"
                />
                Drag and drop files here or click to browse
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Uploaded Files:</h2>
              <div className="max-h-40 overflow-y-auto">
                <ul className="list-disc pl-6">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center">
                        {file.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-8 h-8 mr-2 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <span className="font-semibold">{file.name}</span> -{" "}
                          {file.size > 1024
                            ? file.size > 1048576
                              ? Math.round(file.size / 1048576) + "MB"
                              : Math.round(file.size / 1024) + "KB"
                            : file.size + "B"}
                        </div>
                      </div>
                      <button
                        onClick={() => handleFileDelete(index)}
                        className="text-red-500 hover:text-red-700 mr-2"
                      >
                        <svg
                          className="fill-current w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 6l3 18h12l3-18H3zm2.819 0h12.361l-.95 9.564-.007.071c0 .805-.656 1.464-1.464 1.464H7.24a1.464 1.464 0 01-1.464-1.464l-.007-.071L5.819 6zM12 17.5a.5.5 0 100-1 .5.5 0 000 1zm1-11.5h-2v9h2v-9z" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveUpload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mr-4"
            >
              Save/Upload
            </button>
            <button
              onClick={() => setFiles([])}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md mr-4"
            >
              Clear All
            </button>
            <button
              onClick={cancelUpload}
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-md mr-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFolder;
