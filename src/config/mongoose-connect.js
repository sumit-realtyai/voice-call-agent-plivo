import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();
const mongodbUri = 'mongodb+srv://sumit:Custom_619@realtyai.giipx.mongodb.net/voice_assistant?retryWrites=true&w=majority';
console.log(mongodbUri);
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