import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler(async(req, res) => {
    // get user detail from fromtend
    // valiadate -not empty
    // check user already exist
    // check images for cloudnary
    // upload them to cloudnary
    // create user object in db
    // remove password  and referesh token field from response 
    // check for create user
    // return response

    if(
        [fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All field are required")
    }

   const existedUser =  User.findOne({
        $or: [{ username },  { email }]
    })

    if(existedUser){
        throw new ApiError(409, "user with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar files required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar files required")   
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Somethin went wrong wile registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register successfully")
    )

})

export {registerUser}