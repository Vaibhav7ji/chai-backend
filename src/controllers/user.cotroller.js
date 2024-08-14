import {asyncHandler} from "../utils/asyncHandler"

import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
 const registerUser = asyncHandler(async (req,res)=>{
const {userName,fullName,password,email} =   req.body
if(
    [fullName,email,userName,password].some((field)=>field?.trim()==="")
  )
{
    throw new ApiError(400,"fullname is required")
}

const existedUser = User.findOne({
    $or: [{ userName },{ email }]
})
if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if(!avatar){
    throw new ApiError(400,"not uploaded on cloudinary")
}
// if(!coverImage){
//     throw new ApiError(400,"not uploaded on cloudinary")
// }

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    userName:userName.toLowerCase()

})
const createdUser = await User.findById(user._id).select(
 "-password -refreshToken"   
)
if(!createdUser){
    throw new ApiError(500,"something went wrong while register the user")
}
return res.Status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
)
 })

 
 export {registerUser,}