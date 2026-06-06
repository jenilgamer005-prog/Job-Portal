import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

if (cloudName && apiKey && apiSecret && cloudName !== "Root") {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  console.warn(
    "[cloudinary] Missing or invalid Cloudinary config. Using local upload fallback."
  );
}

export default cloudinary;