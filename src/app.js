import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

// middleware use
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))

// import router
import userRouter from "./routes/user.route.js"

// routes declarations
app.use('/api/v1/user',userRouter)


export {app}

