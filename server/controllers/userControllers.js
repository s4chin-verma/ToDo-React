const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.status(400).json({ error: "Username already taken" });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.status(400).json({ error: "Email already used" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        delete user.password;
        return res.status(201).json({ status: true, user });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Error registering user" });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.status(401).json({ status: false, error: "Incorrect username or password" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ status: false, error: "Incorrect username or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete user.password;
        return res.status(200).json({ status: true, user, token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: "Error logging in" });
    }
};
