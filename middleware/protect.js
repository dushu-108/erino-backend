import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = User.findById(decoded.userId).select("-password");
    if(!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
}
