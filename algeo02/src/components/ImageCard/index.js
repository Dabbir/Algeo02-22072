import Image from "next/image";
import React from "react";

const ImageCard = ({ image, similarity }) => {
  const getStatus = () => {
    if (similarity >= 60) {
      return {
        color: "green",
        text: "Good",
      };
    } else if (similarity >= 40 && similarity < 60) {
      return {
        color: "yellow",
        text: "Okay",
      };
    } else {
      return {
        color: "red",
        text: "Bad",
      };
    }
  };

  const status = getStatus();

  return (
    <div
      className={`w-80 bg-white shadow-xl rounded-md border border-transparent hover:border-2 hover:border-tertiary cursor-pointer`}
    >
      <div className="rounded-md object-cover">
        <img
          src={image}
          width={350}
          height={350}
          alt={`Image card for ${image}`}
          className="rounded-md"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm my-1">
              Similarity: {similarity}%
            </p>
            <span
              className={`uppercase text-xs p-0.5 bg-${status.color}-50 border-${status.color}-500 border rounded text-${status.color}-700 font-medium text-center`}
            >
              {status.text}
            </span>
          </div>
          <button className="text-gray-500 p-1 hover:scale-110">
            <Image src="/download2.svg" width={30} height={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
