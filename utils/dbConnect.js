// utils/dbConnect.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGO_URI ? 'Found' : 'Missing');
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        process.exit(1);
    }
};

export default connectDB;