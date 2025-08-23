import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        generateToken(user._id, res);
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (user.password !== password || user.email !== email) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        generateToken(user._id, res);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const signOut = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0});
        res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

