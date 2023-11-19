const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("file");

module.exports = async (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const filePath = path.join("/uploads", req.file.filename);
      return res.status(200).json({ filePath });
    });
  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
