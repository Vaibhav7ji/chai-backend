import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefreshToken =async(userId)=>{
    try {
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, 'User not found');
      } 
const accessToken =   user.generateAccessToken()
  const refreshToken=  user.generateRefreshToken()
  
    user.refreshToken=refreshToken;
  await  user.save({vaildateBeforeSave:false});
  return {accessToken,refreshToken};
   
  //save hone se pehle password maagta h toh hm thats why pehle hi false krr rhe ki password validate krre hi nhii

        } catch (error) {
            throw new ApiError(500,"something went wrong while generating refresh token")
        }
      }


const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    if (req.files && req.files.avatar) {
        console.log("req.files.avatar:", req.files.avatar);
        console.log("req.files.avatar type:", typeof req.files.avatar);
        console.log("req.files.avatar length:", req.files.avatar.length);


        if (req.files.avatar.length > 0 && req.files.avatar[0].path) {
          console.log("req.files.avatar[0].path:", req.files.avatar[0].path);
          // Your code here
        } else {
          console.log("Avatar file is required");
          // Your error handling code here
        }
      } else {
        console.log("req.files.avatar is null or undefined");
        // Your error handling code here in
      }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        console.error("Avatar file not provided or is in incorrect format.");

        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )


 const loginUser = asyncHandler(async (req,res)=>{

//bring your data from req body
      const {email,username,password}=req.body
      if(!username && !password){       
         throw new ApiError(400,"username and password is required ")
      }
  const user =  await User.findOne({
        $or:[{username},{email}]
      })
      if(!user){
        throw new ApiError(404,"user does't exist")
      }
    const isPasswordVaild=  await user.isPasswordCorrect(password)

    if(!isPasswordVaild){
        throw new ApiError(401,"invalid user credentials ")
      }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
 
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
      const options={
        httpOnly:true,
        //only modified by server
        secure:true
      }
     return res
     .status(200)
     .cookie("access token",accessToken,options)
     .cookie("refresh Token",refreshToken,options)
     .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
     )
 })
 
 const logoutUser = asyncHandler(async (req,res)=>{
    

    //cookie remove krni hogi
   await User.findByIdAndUpdate(
        req.user._id,
        {
            // set gives you an object that what we should have to update that feild 
        $unset: {
                refreshToken: 1 // this removes the field from document
            }   
        },{
            new :true
            //you  got response in return that we will get new updated value
        }
    )
    const options={
        httpOnly:true,
        //only modified by server
        secure:true
      }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out"))
 }) 

 const refreshAccessToken = asyncHandler(async (req,res)=>{


const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorised request")
}
try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user =await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"invalid refresh token request")  
    }
    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401," refresh token expired or used")  
    }
    
    const options={
       httpOnly:true,
       secure:true,
    }
    const {accessToken,newRefreshToken}=  await  generateAccessAndRefreshToken(user._id)
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshTOken",newRefreshToken,options)
      .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "access token refreshed successfully"
        )
    )
} catch (error) {
   throw new ApiError(401,error?.message || "invalid refresh token") 
}
 })
 export {registerUser,loginUser,logoutUser,refreshAccessToken}