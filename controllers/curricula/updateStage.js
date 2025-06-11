const Curriculum = require("../../models/Curriculum");

const updateStage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { stageId } = req.params;
        const { stageNumber, name, description, defaultGithubRepo } = req.body;

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

        if (stageNumber !== undefined && stageNumber !== stage.stageNumber) {
            const existingStage = curriculum.stages.find(
                (s) =>
                    s._id.toString() !== stageId &&
                    s.stageNumber === stageNumber
            );
            if (existingStage) {
                return res.status(400).json({
                    message: "A stage with this number already exists",
                });
            }
        }

        if (stageNumber !== undefined) stage.stageNumber = stageNumber;
        if (name !== undefined) stage.name = name;
        if (description !== undefined) stage.description = description;
        if (defaultGithubRepo !== undefined)
            stage.defaultGithubRepo = defaultGithubRepo;

        await curriculum.save();

        res.status(200).json({
            message: "Stage updated successfully",
            stage,
        });
    } catch (error) {
        console.error("Update stage error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = updateStage;
