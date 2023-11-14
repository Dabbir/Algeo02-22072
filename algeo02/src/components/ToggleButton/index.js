import { useState } from "react";

const ToggleButton = () => {
  const [activeButton, setActiveButton] = useState("color");

  const handleToggle = (button) => {
    setActiveButton(button);
  };

  return (
    <div className="flex m-2 border-2 border-secondary rounded-full justify-between px-4 py-1">
      <button
        onClick={() => handleToggle("color")}
        className={`${
          activeButton === "color"
            ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
            : "text-primary font-semibold transform scale-100 transition-all"
        } mx-2 px-12 py-2 rounded-full`}
      >
        Color
      </button>
      <button
        onClick={() => handleToggle("texture")}
        className={`${
          activeButton === "texture"
            ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
            : "text-primary font-semibold transform scale-100 transition-all"
        } mx-2 px-10 py-2 rounded-full`}
      >
        Texture
      </button>
    </div>
  );
};

export default ToggleButton;
