"use server";
import fs from "fs/promises";
import path from "path";

export async function getImages(folderPath) {
  const directoryPath = path.join(process.cwd(), folderPath);
  const files = await fs.readdir(directoryPath);
  return files.map((file) => path.join(folderPath, file).replace(/\\/g, "/"));
}
