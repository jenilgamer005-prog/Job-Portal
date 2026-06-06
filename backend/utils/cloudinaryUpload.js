import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

const DEFAULT_SERVER_URL = "http://localhost:5000";
const SERVER_BASE_URL = process.env.SERVER_BASE_URL || DEFAULT_SERVER_URL;

const saveLocally = (fileBuffer, folderName, originalName) => {
    const uploadFolder = path.join(process.cwd(), "uploads", folderName);
    fs.mkdirSync(uploadFolder, { recursive: true });

    const safeName = originalName.replace(/\s+/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadFolder, uniqueName);
    fs.writeFileSync(filePath, fileBuffer);

    return {
        secure_url: `${SERVER_BASE_URL}/uploads/${folderName}/${uniqueName}`,
        public_id: uniqueName,
    };
};

// Upload a file buffer (from memory) to Cloudinary or local fallback
export const uploadToCloudinary = async (
    fileBuffer,
    folderName,
    resourceType = "auto",
    publicId = null
) => {
    const hasCloudinaryConfig =
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_SECRET_KEY &&
        process.env.CLOUDINARY_NAME !== "Root";

    if (!hasCloudinaryConfig) {
        console.warn(
            "[uploadToCloudinary] Cloudinary is not configured properly; saving upload locally."
        );
        return saveLocally(fileBuffer, folderName, publicId || "upload");
    }

    return new Promise((resolve, reject) => {
        const options = {
            folder: folderName,
            resource_type: resourceType,
            type: "upload", // Explicitly set to 'upload' for public delivery
            access_mode: "public",
            use_filename: true,
            unique_filename: true,
        };

        if (publicId) {
            // For raw files, Cloudinary uses the public_id as the filename in the URL.
            // We want to keep the extension if it exists.
            if (resourceType === "raw") {
                options.public_id = publicId;
            } else {
                // For images/videos/auto, strip the extension for the public_id to avoid double-extensions in URLs
                options.public_id = publicId.includes(".") ? publicId.split('.').slice(0, -1).join('.') : publicId;
            }
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    console.log("Cloudinary Upload Error:", error);
                    try {
                        const fallback = saveLocally(fileBuffer, folderName, publicId || "upload");
                        return resolve(fallback);
                    } catch (fallbackError) {
                        return reject(fallbackError);
                    }
                }
                console.log("Cloudinary Upload Result:", result);
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );

        // Pipe the buffer to the Cloudinary stream
        uploadStream.end(fileBuffer);
    });
};