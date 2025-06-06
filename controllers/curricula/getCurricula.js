const Curriculum = require("../../models/Curriculum");

const getCurriculua = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find curriculua
        const curriculua = await Curriculum.find({
            owner: userId,
        }).populate({
            path: "projects",
            select: "name description githubLink createdAt updatedAt",
        });

        if (!curriculua || curriculua.length === 0) {
            return res.status(404).json({ message: "No curricula found" });
        }

        res.status(200).json({ curriculua });
    } catch (error) {
        console.error("Get curriculua error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getCurriculua;
