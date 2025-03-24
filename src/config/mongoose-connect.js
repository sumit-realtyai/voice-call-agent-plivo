import mongoose from "mongoose"
const MONGODB_URI=`mongodb+srv://sumit:Custom_619@realtyai.giipx.mongodb.net/voice_assistant?retryWrites=true&w=majority`

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error connecting to database")
    }
}