const express = require("express");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

const app = express();
const imageDir = path.join(__dirname, "/images");

app.get("/images", (req, res) => {
  fs.readdirSync(imageDir, (err, file) => {
    if (err) {
      return res.status(500).json({ error: "Error reading images directory" });
    }
    const imagePath = file.map((file) => `images/${file}`);
    res.json(imagePath);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
