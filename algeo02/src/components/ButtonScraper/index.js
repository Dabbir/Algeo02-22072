// components/ImageScraper.js
import { useState } from "react";

const ImageScraper = ({ onCancelScrape }) => {
  const [urlInput, setUrlInput] = useState("");
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const scrapeImages = async () => {
    try {
      setImages([]);
      setErrorMessage("");
      setShowCancel(true);

      const response = await fetch("http://localhost:5000/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlInput }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setImages(result.images || []);
        setErrorMessage("");
      } else {
        setErrorMessage(
          result.message || "Error scraping images. Please try again."
        );
      }
    } catch (error) {
      console.error("Error scraping images:", error.message);
      setErrorMessage("Error scraping images. Please try again.");
    } finally {
      setShowCancel(false);
    }
  };

  const clearScrape = () => {
    setShowCancel(false);
    setUrlInput("");
    setImages([]);
    setErrorMessage("");
  };

  const cancelScrape = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancelScrape();
    }, 300);
  };

  return (
    <div
      className={`transition-all transform duration-500 ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-0 translate-y-full"
      }`}
    >
      <div className="container mx-auto max-w-screen-lg mt-8">
        <div className="flex items-center justify-center">
          <div className="bg-quaternary rounded-lg box-border p-8 w-[40vw]">
            <form className="flex flex-col gap-4">
              <div className="mx-auto text-white text-3xl font-semibold mt-6">
                Image Scraper
              </div>
              <label htmlFor="urlInput" className="text-xl">
                Enter URL:
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="urlInput"
                  name="urlInput"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                  className="text-black p-2 focus:outline-1 w-full focus:outline-blue-500 font-bold border-[0.1px] resize-none border-[#9EA5B1] rounded-md"
                />
                <button
                  type="button"
                  onClick={clearScrape}
                  className="bg-quinary p-2 rounded-md hover:opacity-80"
                >
                  Clear
                </button>
              </div>
              <div className="container mx-auto max-w-screen-lg mt-2 font-semibold text-red-600">
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
              </div>
              <button
                type="button"
                onClick={scrapeImages}
                disabled={showCancel}
                className="submit bg-quinary rounded-lg border-none text-white font-semibold text-lg h-12 mt-auto w-full hover:opacity-80"
              >
                Scrape Images
              </button>
              <button
                type="button"
                onClick={cancelScrape}
                className="hover:opacity-80"
              >
                Cancel
              </button>
              {images.length > 0 &&
                images.map((imageUrl, index) => (
                  <img key={index} src={imageUrl} alt={`Image ${index}`} />
                ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageScraper;
