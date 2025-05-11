import mongoose from "mongoose";

export async function connectToMongoDB(url) {
    try {
        const conn = await mongoose.connect(url);
        console.log("MONGO_DB connected successfully...");
        console.log("conn.connection.name ", conn.connection.name)
    } catch (error) {
        console.log("error ", error);
    }
}