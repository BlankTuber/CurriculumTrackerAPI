const Curriculum = require("../../models/Curriculum");

const getLevel = async (req, res) => {
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

        const level = curriculum.levels.id(levelId);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }

        res.status(200).json({ level });
    } catch (error) {
        console.error("Get level error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getLevel;
