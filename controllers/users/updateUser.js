const argon2 = require("argon2");
const User = require("../../models/User");

const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, password, currentPassword } = req.body;

        // Get current user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateFields = {};

        // Update username if provided
        if (username && username !== user.username) {
            // Check if new username already exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res
                    .status(409)
                    .json({ message: "Username already exists" });
            }
            updateFields.username = username;
        }

        // Update password if provided
        if (password) {
            if (!currentPassword) {
                return res.status(400).json({
                    message: "Current password is required to set new password",
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await argon2.verify(
                user.password,
                currentPassword
            );
            if (!isCurrentPasswordValid) {
                return res
                    .status(401)
                    .json({ message: "Current password is incorrect" });
            }

            // Hash new password
            updateFields.password = await argon2.hash(password);
        }

        // Check if there's anything to update
        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({ message: "No valid fields to update" });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
            new: true,
            runValidators: true,
        }).select("-password");

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
            },
        });
    } catch (error) {
        console.error("Update user error:", error);

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

module.exports = updateUser;
