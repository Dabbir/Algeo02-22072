"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import ImageCard from "../ImageCard";

const GallerySimilar = ({ statusSearch, activeButton }) => {
  const [images, setImages] = useState([]);
  const [time, setTime] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  useEffect(() => {
    let apiUrl = "";

    if (activeButton === "color") {
      apiUrl = "http://127.0.0.1:8080/api/process_image";
    } else if (activeButton === "texture") {
      apiUrl = "http://127.0.0.1:5001/api/process_image";
    }

    if (apiUrl) {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.status);
          setTime(data.time);
          setImages(data.results);
        });
    }
  }, [statusSearch, activeButton]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  console.log(currentImages);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col md:mx-60 sm:mx-32 my-10 gap-12 gap-y-6 justify-center">
      <div className="flex justify-between font-semibold">
        <p className="text-2xl text-primary">Result:</p>
        <p>
          {images.length} results in {time} seconds.
        </p>
      </div>
      <div className="flex flex-wrap my-10 gap-12 gap-y-6 justify-center">
        {currentImages.map((image, index) => (
          <ImageCard
            key={index}
            image={
              "http://localhost:5000/dataset/" +
              image.image_path.split("\\").pop()
            }
            similarity={(image.similarity * 100).toFixed(4)}
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

export default GallerySimilar;
