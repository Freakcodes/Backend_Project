import { asyncHandler } from "../../utils/asyncHandler.js";
import {apiError} from "../../utils/apiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../../utils/cloudinary.js";
import {apiResponse} from "../../utils/apiResponse.js"

const generateAccessandRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken
        const refreshToken=user.generateRefreshToken
        user.refreshToken=refreshToken;
        user.save({validateBeforeSave:false})

        return{accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500,"Something went wrong while generating refresh and access token")
    }
}
const registerUser=asyncHandler(async(req,res)=>{
   //get userdetails from frontend
   //validation -not empty
   //check if user already exists..

    const {fullName,email,username,password}=req.body
    console.log("email :",email);
    if(
        [fullName, email, username, password].some((field)=>field?.trim()==="")
    ){
        throw new apiError(400,"All fields are required");
    }
    const existedUser = await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new apiError(409,"User already exist")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"Avatar file is required ")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new apiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200,createdUser,"User registered successfully")
    )
})

const loginUser=asyncHandler(async(req,res)=>{
    //get user details from frontend..
    //check if the field is empty or not..
    //check the username/email..if the user has registered or not..
    //verify the password..
    //access token and refresh token generation...
    //send cookie..
    //display  user logged in...
    const{email,username,password}=req.body

    if(!username||!email){
        throw new apiError(400,"username or password required");
    }
    
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apiError(404,"user not found");
    }

    const isPasswordValid= await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(401,"Invalid user credentials");
    }

    const {accessToken,refreshToken}=await generateAccessandRefreshTokens(user._id)


})


export {registerUser,loginUser};