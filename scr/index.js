import dotenv from "dotenv"
import connectDB from "./DB/index.js";
import { app } from "./app.js";
// import dns from 'node:dns';   // ya const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);  // Google DNS
// // ya Cloudflare: ['1.1.1.1', '1.0.0.1']

dotenv.config({
    path: '/.env'
})




connectDB()
.then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Surver is running at port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`Mongodb connection failed: ${err}`)
})

