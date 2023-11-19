"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import ImageCard from "../ImageCard";

const GallerySimilar = ({ activeButton }) => {
  const [result, setResult] = useState([]);
  const [timeColor, setTimeColor] = useState();
  const [timeTexture, setTimeTexture] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(false);
  const [texture, setTexture] = useState(false);
  const [emptyDataset, setEmptyDataset] = useState(false);
  const imagesPerPage = 6;

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8080/api/process_image")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.status);
        setTimeColor(data.time_of_color_process);
        setTimeTexture(data.time_of_texture_process);
        setResult(data.results);
      })
      .finally(() => {
        setLoading(false);
      });

    // if (result.length === 0) {
    //   setEmptyDataset(true);
    // }

    if (activeButton === "color") {
      setColor(true);
      setTexture(false);
    } else if (activeButton === "texture") {
      setColor(false);
      setTexture(true);
    }
  }, [activeButton]);

  const sortedImages = result.slice().sort((a, b) => {
    const similarityA = color ? a.similarity_color : a.similarity_texture;
    const similarityB = color ? b.similarity_color : b.similarity_texture;
    return similarityB - similarityA;
  });

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = sortedImages.slice(indexOfFirstImage, indexOfLastImage);
  console.log(currentImages);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const currentImagesAboveThreshold = currentImages.filter((image) => {
    const similarity = color
      ? image.similarity_color
      : image.similarity_texture;
    return similarity >= 0.6; // 60% similarity threshold
  });

  return (
    <div className="flex flex-col md:mx-60 sm:mx-32 my-10 gap-12 gap-y-6 justify-center">
      <div className="flex flex-col">
        <div className="flex justify-between font-semibold">
          <p className="text-2xl text-primary">Result:</p>
          {emptyDataset ? (
            <p>{`${currentImagesAboveThreshold.length} results in 0 seconds.`}</p>
          ) : (
            <p>
              {loading
                ? "loading..."
                : color
                ? `${currentImagesAboveThreshold.length} results in ${
                    currentImagesAboveThreshold.length === 0 ? 0 : timeColor
                  } seconds.`
                : `${currentImagesAboveThreshold.length} results in ${
                    currentImagesAboveThreshold.length === 0 ? 0 : timeTexture
                  } seconds.`}
            </p>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-primary h-12 w-12"></div>
            <span className="ml-3 text-primary">Loading...</span>
          </div>
        ) : emptyDataset ? (
          <div className="flex items-center justify-center">
            <span className="text-xl text-primary">No result</span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap my-10 gap-12 gap-y-6 justify-center">
              {currentImagesAboveThreshold.map((image, index) => (
                <ImageCard
                  key={index}
                  image={
                    "http://localhost:4000/dataset/" +
                    image.image_path.split("\\").pop()
                  }
                  similarity={(
                    (color
                      ? image.similarity_color
                      : image.similarity_texture) * 100
                  ).toFixed(4)}
                />
              ))}
            </div>
            <div
              className={`${
                currentImagesAboveThreshold.length <= 3
                  ? "mt-[26.65em]"
                  : "mt-0"
              } justify-center`}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  currentImagesAboveThreshold.length / imagesPerPage
                )}
                onPageChange={paginate}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GallerySimilar;
