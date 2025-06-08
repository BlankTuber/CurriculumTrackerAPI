const Curriculum = require("../../models/Curriculum");

const getCurricula = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find curricula
        const curricula = await Curriculum.find({
            owner: userId,
        }).populate({
            path: "projects",
            select: "name description githubLink createdAt updatedAt",
        });

        if (!curricula || curricula.length === 0) {
            return res.status(404).json({ message: "No curricula found" });
        }

        res.status(200).json({ curricula });
    } catch (error) {
        console.error("Get curricula error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getCurricula;
