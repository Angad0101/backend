import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dns from 'node:dns';   // ya const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);  // Google DNS
// ya Cloudflare: ['1.1.1.1', '1.0.0.1']


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.
        MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoBD connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoBD connection error", error)
    }
}

export default connectDB;