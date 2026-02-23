import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the configuration
try {
  console.log(`Cloudinary connected: ${cloudinary.config().cloud_name} 🚀`);
} catch (error) {
  console.error("Cloudinary config failed", error);
}

export default cloudinary;
