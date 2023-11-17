const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
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

app.post("/api/upload", upload.any("photo"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file received");
    }

    let finalImageURL =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

    res.json({ status: "success", image: finalImageURL });
  } catch (error) {
    console.error("Error processing upload:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("App is running on http://localhost:" + PORT);
});
