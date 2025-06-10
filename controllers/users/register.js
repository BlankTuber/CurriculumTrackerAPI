const argon2 = require("argon2");
const User = require("../../models/User");

const register = async (req, res) => {
    try {
        const { username, password, githubUsername } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        if (githubUsername) {
            const existingGithubUser = await User.findOne({ githubUsername });
            if (existingGithubUser) {
                return res
                    .status(409)
                    .json({ message: "GitHub username already exists" });
            }
        }

        const hashedPassword = await argon2.hash(password);

        const user = new User({
            username,
            password: hashedPassword,
            githubUsername,
        });

        await user.save();

        req.session.userId = user._id;

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                githubUsername: user.githubUsername,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

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
