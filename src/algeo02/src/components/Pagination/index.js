import React, { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [selectedPage, setSelectedPage] = useState(currentPage);

  const handlePageChange = (page) => {
    setSelectedPage(page);
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageDisplay = 3; // Adjust this value to control the number of pages displayed

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= selectedPage - Math.floor(maxPageDisplay / 2) &&
          i <= selectedPage + Math.floor(maxPageDisplay / 2))
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((number, index) => (
      <span
        key={index}
        className={`mx-1 cursor-pointer ${
          number === selectedPage
            ? "font-bold text-primary underline underline-offset-8"
            : ""
        }`}
        onClick={() => (number !== "..." ? handlePageChange(number) : null)}
      >
        {number}
      </span>
    ));
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <div className="flex justify-between items-center w-[25em]">
        <button
          className="mx-1 px-2 py-1 text-black bg-primary bg-opacity-75 rounded-md cursor-pointer"
          onClick={() => handlePageChange(selectedPage - 1)}
          disabled={selectedPage === 1}
        >
          {"<"}
        </button>
        {renderPageNumbers()}
        <button
          className="mx-1 px-2 py-1 text-black bg-primary bg-opacity-75 rounded-md cursor-pointer"
          onClick={() => handlePageChange(selectedPage + 1)}
          disabled={selectedPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
