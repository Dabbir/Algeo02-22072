import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

const readFile = (req, saveLocally) => {
  const option = {};
  if (saveLocally) {
    option.uploadDir = path.join(process.cwd(), "/uploads");
    option.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + form.originalFilename;
    };
  }

  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req, res) => {
  try {
    await fs.access(path.join(process.cwd(), "/uploads"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd(), "/uploads"));
  }

  try {
    const { files } = await readFile(req, true);
    const filePath = path.join(process.cwd(), "/uploads", files.myImage.name);
    await fs.rename(files.myImage.path, filePath);
    res.json({ done: "ok" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export default handler;
