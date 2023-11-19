import React from "react";

const BackgroundComponent = () => {
  const boxCount = 500;

  return (
    <div className="bg-transparent max-h-[100vh] flex flex-wrap gap-1 justify-center">
      {[...Array(boxCount)].map((_, index) => (
        <div
          key={index}
          className="w-[3.75%] p-2 relative"
          style={{ paddingTop: "2%" }} // Maintain a 1:1 aspect ratio
        >
          <div className="absolute bg-[#181818] backdrop-brightness-110 inset-0 blur-[2px] rounded-xl transition duration-[2000ms] ease hover:duration-0  hover:bg-secondary"></div>
        </div>
      ))}
    </div>
  );
};

export default BackgroundComponent;
