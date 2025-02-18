import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const uploadOnCloudinary = async (localPathFile) => {
    try {
        if (!localPathFile) return null;
        
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(localPathFile, {
            resource_type: "auto",
        });

        // Ensure result contains a valid URL
        if (!result || !result.url) {
            throw new Error("Cloudinary upload failed");
        }

        //console.log("File uploaded on Cloudinary: ", result.url);
        
        // Remove the locally saved temporary file
        fs.unlinkSync(localPathFile);

        return result;  // Return result instead of undefined 'response'
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        
        // Ensure the temporary file is deleted even in case of failure
        if (fs.existsSync(localPathFile)) {
            fs.unlinkSync(localPathFile);
        }

        return null;
    }
};

export { uploadOnCloudinary };
