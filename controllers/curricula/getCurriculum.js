const Curriculum = require("../../models/Curriculum");

const getCurriculum = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;

        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        }).populate({
            path: "projects",
            select: "name description identifier topics githubRepo state stage order createdAt updatedAt",
        });

        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        res.status(200).json({ curriculum });
    } catch (error) {
        console.error("Get curriculum error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getCurriculum;
