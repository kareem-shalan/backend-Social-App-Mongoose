import mongoose from "mongoose";

const connectDB = async () => {
    const url = "mongodb+srv://kareemmohamedali330:karem123456@cluster0.vfwi1zd.mongodb.net/MongooseApp"

    try {
        await mongoose.connect(url)
        console.log(`connect correctly🚀🚀🚀`);
        
    } catch (error) {
        console.log(`felid to connect to db❌❌❌❌ `);
        
        
    }
}
export default connectDB