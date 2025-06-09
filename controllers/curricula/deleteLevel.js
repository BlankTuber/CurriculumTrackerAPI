const Curriculum = require("../../models/Curriculum");

const deleteLevel = async (req, res) => {
    try {
        const userId = req.user._id;
        const { levelId } = req.params;

        const curriculum = await Curriculum.findOne({
            owner: userId,
            "levels._id": levelId,
        });

        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Level not found or access denied" });
        }

        curriculum.levels.pull({ _id: levelId });
        await curriculum.save();

        res.status(200).json({ message: "Level deleted successfully" });
    } catch (error) {
        console.error("Delete level error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteLevel;
