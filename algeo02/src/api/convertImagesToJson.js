const fs = require("fs");
const sharp = require("sharp");

const inputDirectory = "./images";
const outputJsonFile = "./outputDataset.json";

// Function to process each image and extract relevant information
const processImage = async (filePath) => {
  try {
    const imageInfo = await sharp(filePath).metadata();

    return {
      path: filePath,
      width: imageInfo.width,
      height: imageInfo.height,
      format: imageInfo.format,
    };
  } catch (error) {
    console.error(`Error processing image ${filePath}:`, error.message);
    return null;
  }
};

// Read the image files in the input directory
const readImages = () => {
  return fs
    .readdirSync(inputDirectory)
    .map((file) => `${inputDirectory}/${file}`);
};

// Process each image and create an array of image information
const processImages = async () => {
  const imagePaths = readImages();
  const imageInfoArray = [];

  for (const imagePath of imagePaths) {
    const imageInfo = await processImage(imagePath);
    if (imageInfo) {
      imageInfoArray.push(imageInfo);
    }
  }

  return imageInfoArray;
};

// Save the image information as JSON
const saveToJson = async () => {
  const imageInfoArray = await processImages();
  const jsonData = JSON.stringify(imageInfoArray, null, 2);

  fs.writeFileSync(outputJsonFile, jsonData);
  console.log(`JSON data saved to ${outputJsonFile}`);
};

// Run the script
saveToJson();
