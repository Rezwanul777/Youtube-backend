import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

// database connection
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})




// (async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`)
        
//         app.on("Error",error => console.log("Error",error))

//         app.listen(process.env.PORT,()=>{
//             console.log(`Server running on port ${process.env.PORT}`)
//             console.log(`Connected to ${DB_NAME}`)
//         })
//     } catch (error) {
//         console.log("Error",error);
//         throw new Error
//     }
// })()