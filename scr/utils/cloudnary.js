import {v2 as cloudnary} from "cloudinary"
import fs from "fs"

    cloudnary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAM, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });






const uploadCloudnary = async (localfilepath) => {
    try {
        if(!localfilepath) return null
        const response = await cloudnary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on cloudnary",
            response.url);
            return response
    } catch (error) {
        fs.unlinkSync(localfilepath) // remove locally saved temporary file as upload operation got fail
    }
}

export {uploadCloudnary}