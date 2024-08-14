import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_key,
    api_secret:process.env.CLOUDINARY_API_SECRET

})
const uploadOnCloudinary = async (localFilePath)=>{
try {
    if (!localFilePath) return null
    //upload the fiile on cloudinary
   const response = await cloudinary.uploader.upload(localFilePath,{    resourse_type:"auto"
    })
       console.log("file is uploaded on cloudinary",response.url) ;
       return response
    
} catch (error) {
    fs.unlinkSync(localFilePath)
    //remove the locally saved temporary file as the upload operation got failed because of mallessios file 
}
}
export {uploadOnCloudinary}