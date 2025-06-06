const User = require("../../models/User");
const Curriculum = require("../../models/Curriculum");

const getUser = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user with basic stats
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get user's curricula count
        const curriculaCount = await Curriculum.countDocuments({
            owner: userId,
        });

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            stats: {
                curriculaCount,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getUser;
