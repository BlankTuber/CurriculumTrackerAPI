const argon2 = require("argon2");
const User = require("../../models/User");

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();

        // Create session
        req.session.userId = user._id;

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = register;
