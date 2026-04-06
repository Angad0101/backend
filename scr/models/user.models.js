import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
         fullname: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String, // Cloudnary url
            required: true
        },
        coverImage:{
            type: String // Cloudnary url
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refereshToken: {
            type: String
        }
    },
{timestamps: true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRE,
        {
            expiresIN: process.env.ACCESS_TOKEN_EXPIRY  
        }
    )
}
userSchema.method.generateRefereshToken = function(){
        return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFERESH_TOKEN_SECRET,
        {
            expiresIN: process.env.REFERESH_TOKEN_EXPIRY  
        }
    )
}




export const User = mongoose.model("user", userSchema)