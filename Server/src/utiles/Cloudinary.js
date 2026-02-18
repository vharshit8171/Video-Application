import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const UploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null
        const UploadResult = await cloudinary.uploader.upload(localfilepath,
            { resource_type: 'auto' })
        return UploadResult
    } catch (error) {
        // console.error("Cloudinary Upload Error:", error);
        if (localfilepath && fs.existsSync(localfilepath)) {
            // // remove the locally saved temporary file as the upload is failed
            await fs.promises.unlink(localfilepath);
        }
        throw error;
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "video") => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
}

export { UploadOnCloudinary, deleteFromCloudinary }