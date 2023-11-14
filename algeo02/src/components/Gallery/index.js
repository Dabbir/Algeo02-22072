"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import ImageCard from "../ImageCard";
import { getImages } from "@/utils/images";

const Gallery = ({ folderPath }) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  useEffect(() => {
    const fetchImages = async () => {
      const allImages = await getImages(folderPath);
      setImages(allImages);
    };

    fetchImages();
  }, [folderPath]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col md:mx-60 sm:mx-32 my-10 gap-12 gap-y-6 justify-center">
      <div className="flex flex-wrap my-10 gap-12 gap-y-6 justify-center">
        {currentImages.map((image, index) => (
          <ImageCard
            key={index}
            image={image.replace("/public", "")}
            similarity={index * 15}
          />
        ))}
      </div>
      <div
        className={`${
          currentImages.length <= 3 ? "mt-[26.65em]" : "mt-0"
        } justify-center`}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(images.length / imagesPerPage)}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};

export default Gallery;
