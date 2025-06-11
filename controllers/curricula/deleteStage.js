const Curriculum = require("../../models/Curriculum");

const deleteStage = async (req, res) => {
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

        curriculum.stages.pull({ _id: stageId });
        await curriculum.save();

        res.status(200).json({ message: "Stage deleted successfully" });
    } catch (error) {
        console.error("Delete stage error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteStage;
