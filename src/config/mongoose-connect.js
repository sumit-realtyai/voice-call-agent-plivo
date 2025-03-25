import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();
const mongodbUri = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error connecting to database")
    }
}