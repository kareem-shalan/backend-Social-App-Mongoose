import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDB = async () => {
    const url = process.env.MONGO_URI;

    if (!url) {
        console.error("❌ MONGO_URI environment variable is not defined");
        process.exit(1);
    }

    try {
        await mongoose.connect(url);
        console.log("✅ Connected to MongoDB successfully 🚀");
        
    } catch (error) {
        console.error("❌ Failed to connect to database:", error.message);
        process.exit(1);
    }
}

export default connectDB;