import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {uploadCloudinary} from "../utils/cloudinary.js"


const registerUser = asyncHandler(async(req, res) => {
    // get user detail from frontend
    // valiadate -not empty
    // check user already exist
    // check images for cloudnary
    // upload them to cloudnary
    // create user object in db
    // remove password  and referesh token field from response 
    // check for create user
    // return response


    const { username, email, fullname, password} = req.body;

    if(
        [username, email, fullname, password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All field are required")
    }

   const existedUser =  await User.findOne({
        $or: [{ username },  { email }]
    })

    console.log(`existedUser: ${existedUser}`)
    
    
    if(existedUser){
        throw new ApiError(409, "user with email or username already exist")
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    
    console.log(`avatarLocalPath: ${avatarLocalPath} coverImageLocalPath: ${coverImageLocalPath}`)
    
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar filespath required")
    }
    
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath)
    
    console.log(`avatar: ${avatar} coverImage: ${coverImage}`)
    
    if(!avatar){
        throw new ApiError(400, "Avatar files required")   
    }
    if(!coverImage){
        throw new ApiError(400, "coverImage files required")   
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    console.log(`user : ${user}`)
    
    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    
    console.log(`createdUser : ${createdUser}`)

    if(!createdUser){
        throw new ApiError(500, "Somethin went wrong wile registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register successfully")
    )

})

export {registerUser}