import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileUpload }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFileUpload(acceptedFiles[0]);
    },
  });

  const uploadedFile = acceptedFiles[0];

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-[#6d28d9] rounded-lg m-2 p-6 max-w-2xl text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploadedFile ? (
        <img
          src={URL.createObjectURL(uploadedFile)}
          alt={uploadedFile.path}
          className="mx-auto max-w-full max-h-[60vh] h-auto"
        />
      ) : (
        <p className="text-gray-600">
          Drag and drop an image here, or click to select one
        </p>
      )}
      {uploadedFile && (
        <div className="mt-4">
          <h5 className="text-lg font-semibold">Uploaded Image:</h5>
          <ul className="list-disc list-inside">
            <li className="text-gray-700">
              {uploadedFile.path} - {uploadedFile.size} bytes
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
