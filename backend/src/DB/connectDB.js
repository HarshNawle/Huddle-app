import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURL = process.env.DATABASE_URL;

        if(!mongoURL){
            throw new Error("Database URL is not defined");
        }
    
        await mongoose.connect(mongoURL)
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log( "Error connecting to MongoDB", error)
        throw error
    }
}
export default connectDB