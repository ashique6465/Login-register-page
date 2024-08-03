import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { UserRouter } from './routes/user.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'


dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"], // Allow requests from this origin
    credentials: true // Allow sending cookies from this origin
}))
app.use(cookieParser())


// Routes
app.use('/auth', UserRouter)

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/authentication', {
   
}).then(() => {
    console.log("MongoDB connected")
}).catch(err => console.log(err))

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
