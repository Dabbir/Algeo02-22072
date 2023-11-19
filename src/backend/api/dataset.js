const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/dataset");
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/upload", upload.array("files"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files received");
    }

    const finalImageURLs = req.files.map((file) => {
      return (
        req.protocol + "://" + req.get("host") + "/dataset/" + file.filename
      );
    });
    res.setHeader("Content-Type", "application/json");
    res.json({ status: "success", images: finalImageURLs });
  } catch (error) {
    console.error("Error processing upload:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("App is running on http://localhost:" + PORT);
});
