import dotenv from "dotenv"
import connectDB from "./DB/index.js";
import { app } from "./app.js";

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

