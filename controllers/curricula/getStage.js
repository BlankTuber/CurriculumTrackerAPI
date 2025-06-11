const Curriculum = require("../../models/Curriculum");

const getStage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { stageId } = req.params;

        const curriculum = await Curriculum.findOne({
            owner: userId,
            "stages._id": stageId,
        });

        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Stage not found or access denied" });
        }

        const stage = curriculum.stages.id(stageId);
        if (!stage) {
            return res.status(404).json({ message: "Stage not found" });
        }

        res.status(200).json({ stage });
    } catch (error) {
        console.error("Get stage error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getStage;
