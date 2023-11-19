// ToggleButton.js
import { useState } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
    weight: ["400", "500", "800"],
    subsets: ["latin"],
  });

const StepsCard = () => {
    return (
        <section className="flex flex-row z-10 m-[10vh] items-center justify-center h-4/5 font-semibold">
            <dev class="card-container"/>
                <div class="card">
                    <div class="text">
                        <ol className={`${orbitron.className}`}>
                            <div class="top">
                                <li className={`${orbitron.className}`}>Click the "Search" button on the top right corner</li>
                                <li className={`${orbitron.className}`}>Upload your dataset by choosing a folder or by scraping images from the internet</li>
                                <li className={`${orbitron.className}`}>Upload an image by selecting a file from your computer or by taking a photo with your camera</li>
                            </div>
                            <div class="bottom">
                                <li className={`${orbitron.className}`}>Choose the option to search based on color or texture</li>
                                <li className={`${orbitron.className}`}>Click on the "Search" button beside your uploaded image</li>
                                <li className={`${orbitron.className}`}>Images from the dataset that are most similar to the uploaded image will be shown and sorted by the most similar</li>
                            </div> 
                        </ol>
                    </div>
                    <div class="previous-icon" id="previousIcon">
                        <div class="arrow"></div>
                    </div>
                </div>  
        </section>
    );
  };

const TextureCard = () => {
    return (
        <section className="flex flex-row z-10 m-[10vh] items-center justify-center h-4/5 font-semibold">
            <dev class="card-container"/>
                <div class="card">
                    <div class="text">
                        <p class="top">Texture-based CBIR is based on comparing the "roughness" of two images. It is done by converting a colored image into grayscale, then utilizing a coccurrence matrix to quantify the roughness of the image. Normalize the coccurrence matrix, and we can get attri-</p>
                        <p class="bottom">-butes such as contrast, entropy, and homogeneity. Those attributes are then transformed into a vector and the resemblance of two images can be obtained by using the Cosine Similarity Theorem.</p>
                    </div>
                    <div class="previous-icon" id="previousIcon">
                        <div class="arrow"></div>
                    </div>
                </div>  
        </section>
    );
  };

const ColorCard = () => {
    return (
        <section className="flex flex-row z-10 m-[10vh] items-center justify-center h-4/5 font-semibold">
            <dev class="card-container"/>
                <div class="card">
                    <div class="text">
                        <p class="top">In color based CBIR, color histograms are used to quantify the frequency of various colors in a certain range. Color histograms cannot detect a specific object from an image. An image in RGB format is converted to HSV format first because HSV can be used</p>
                        <p class="bottom">for images with white backgrounds. After the image is converted into HSV format, each pixel of the image is quantified into bins in order to create a frequency vector. The vectors can then be used in the Cosine Similarity Theorem to measure the resemblance between two images.</p>
                    </div>
                    <div class="previous-icon" id="previousIcon">
                        <div class="arrow"></div>
                    </div>
                </div>  
        </section>
    );
  };

const ToggleButton = () => {
  const [activeButton, setActiveButton] = useState("color");
  const [ShowColor, setShowColor] = useState(true);
  const [ShowTexture, setShowTexture] = useState(false);
  const [ShowSteps, setShowSteps] = useState(false);

  const handleToggle = (button) => {
    setActiveButton(button);

    switch (button) {
      case "color":
        setShowColor(true);
        setShowTexture(false);
        setShowSteps(false);
        break;
      case "texture":
        setShowColor(false);
        setShowTexture(true);
        setShowSteps(false);
        break;
      case "steps":
        setShowColor(false);
        setShowTexture(false);
        setShowSteps(true);
        break;
      default:
        setShowColor(false);
        setShowTexture(false);
        setShowSteps(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleToggle("color")}
        className={`${
          activeButton === "color"
            ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
            : "text-primary transform scale-100 transition-all"
        } mx-2 px-12 py-2 rounded-full`}
      >
            CBIR Color
      </button>
      <button
        onClick={() => handleToggle("steps")}
        className={`${
          activeButton === "steps"
            ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
            : "text-primary transform scale-100 transition-all"
        } mx-2 px-10 py-2 rounded-full`}
      >
        Steps
      </button>
      <button
        onClick={() => handleToggle("texture")}
        className={`${
          activeButton === "texture"
            ? "bg-gradient-to-r from-quaternary to-primary text-white transform scale-105 transition-all"
            : "text-primary transform scale-100 transition-all"
        } mx-2 px-10 py-2 rounded-full`}
      >
        CBIR Texture
      </button>
      {ShowColor && <ColorCard />}
      {ShowTexture && <TextureCard />}
      {ShowSteps && <StepsCard />}
    </div>
  );
};

export default ToggleButton;
