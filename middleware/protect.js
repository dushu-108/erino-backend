import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No token provided" });
        }
        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // 3. Get user from token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // 4. Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        res.status(500).json({ error: "Authentication failed" });
    }
}
