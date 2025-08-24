import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import connectDB from './utils/dbConnect.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});