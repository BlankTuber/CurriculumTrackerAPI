const argon2 = require("argon2");
const User = require("../../models/User");
const Curriculum = require("../../models/Curriculum");
const Project = require("../../models/Project");
const Note = require("../../models/Note");

const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        // Validate password
        if (!password) {
            return res
                .status(400)
                .json({ message: "Password is required to delete account" });
        }

        // Get user and verify password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Find all curricula owned by the user
        const curricula = await Curriculum.find({ owner: userId });

        // Collect all project IDs from all curricula
        const projectIds = curricula.reduce((acc, curriculum) => {
            return acc.concat(curriculum.projects);
        }, []);

        // Delete all notes associated with the user's projects
        if (projectIds.length > 0) {
            await Note.deleteMany({ project: { $in: projectIds } });
        }

        // Delete all projects associated with the user's curricula
        if (projectIds.length > 0) {
            await Project.deleteMany({ _id: { $in: projectIds } });
        }

        // Delete all curricula owned by the user
        await Curriculum.deleteMany({ owner: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Destroy session
        req.session.destroy();

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteUser;
