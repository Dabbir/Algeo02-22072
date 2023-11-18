const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const JSZip = require("jszip");
const fs = require("fs").promises;
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const uploadDestination = path.join(__dirname, "public", "uploads");
const datasetDestination = path.join(__dirname, "public", "dataset");

// Keep track of uploaded files in memory
const uploadedFiles = {
  "/uploads": [],
  "/dataset": [],
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination =
      req.path === "/api/upload" ? uploadDestination : datasetDestination;
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/upload", upload.single("photo"), uploadHandler);

app.post("/api/dataset", upload.array("files"), datasetUploadHandler);

app.post("/api/scrape", scrapeHandler);

async function uploadHandler(req, res) {
  try {
    if (!req.file) {
      throw new Error("No file received");
    }

    const destination = uploadDestination;
    const filePath = path.join(destination, req.file.filename);

    // Remove existing file with the same name
    await removeExistingFileByUrl(filePath);

    const imageURL =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

    // Update the list of uploaded files
    uploadedFiles["/uploads"].push(imageURL);

    res.json({ status: "success", image: imageURL, destination });
    notifyUpdate("/uploads");
  } catch (error) {
    console.error("Error processing upload:", error.message);
    res
      .status(500)
      .json({ status: "error", message: error.message, destination });
  }
}

async function datasetUploadHandler(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files received");
    }

    const finalImageURLs = [];

    // Process each file
    for (const file of req.files) {
      const filePath = path.join(datasetDestination, file.filename);

      // Remove existing file with the same name
      await removeExistingFileByUrl(filePath);

      if (file.mimetype === "application/zip") {
        // Handle zip file
        const zip = new JSZip();
        const zipData = await fs.readFile(file.path);
        const zipContents = await zip.loadAsync(zipData);

        // Extract each file from the zip
        await Promise.all(
          Object.keys(zipContents.files).map(async (filename) => {
            const content = await zipContents.files[filename].async(
              "nodebuffer"
            );
            const extractedFile = path.normalize(
              path.join(datasetDestination, filename)
            );

            // Remove existing file with the same name
            await removeExistingFileByUrl(extractedFile);

            await fs.writeFile(extractedFile, content);
            finalImageURLs.push(
              req.protocol + "://" + req.get("host") + "/dataset/" + filename
            );
          })
        );
      } else {
        // Handle regular file
        const imageURL =
          req.protocol + "://" + req.get("host") + "/dataset/" + file.filename;
        finalImageURLs.push(imageURL);
      }

      // Update the list of uploaded files
      uploadedFiles["/dataset"].push(...finalImageURLs);
    }

    res.json({
      status: "success",
      images: finalImageURLs,
      destination: datasetDestination,
    });
    notifyUpdate("/dataset");
  } catch (error) {
    console.error("Error processing dataset upload:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function scrapeHandler(req, res) {
  try {
    const { url } = req.body;

    // Scrape images based on the provided URL (you can modify this logic)
    const scrapedImages = await scrapeImagesFromUrl(url);

    // Save the scraped images to the /dataset folder
    const savedImages = await saveImagesToDataset(scrapedImages);

    res.json({ status: "success", images: savedImages });
  } catch (error) {
    console.error("Error scraping images:", error.message);
    res.status(500).json({ status: "error", message: "Error scraping images" });
  }
}

async function scrapeImagesFromUrl(url) {
  // Implement your logic to scrape images based on the provided URL
  // For simplicity, let's assume there is a function called `scrapeImages`
  // that returns an array of image URLs
  const scrapedImages = await scrapeImages(url);
  return scrapedImages;
}

async function saveImagesToDataset(images) {
  const finalImageURLs = [];

  // Process each scraped image
  for (const imageUrl of images) {
    // Save the image to the /dataset folder
    const filename = path.basename(urlparse(imageUrl).path);
    const filePath = path.join(datasetDestination, filename);

    await downloadImage(imageUrl, filePath);

    finalImageURLs.push(
      `${req.protocol}://${req.get("host")}/dataset/${filename}`
    );
  }

  return finalImageURLs;
}

async function downloadImage(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(filePath, response.data);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
    throw error;
  }
}

async function removeExistingFileByUrl(fileUrl) {
  try {
    // Use path.sep to handle both forward and backward slashes
    const urlParts = fileUrl.split(path.sep);
    const filename = urlParts[urlParts.length - 1];

    // Use path.join to create the file path
    const filePath = path.normalize(path.join(datasetDestination, filename));

    // Await the unlink operation to ensure it completes before proceeding
    await fs.unlink(filePath);
    console.log(`File removed: ${filePath}`);
  } catch (error) {
    // Log the error
    console.error(`Error removing file (${fileUrl}):`, error.message);

    // Ignore errors if the file doesn't exist
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

function notifyUpdate(path) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({ action: "update", path }));
  });
}

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log("App is running on http://localhost:" + PORT);
});
