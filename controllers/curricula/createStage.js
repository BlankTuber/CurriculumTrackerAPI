const Curriculum = require("../../models/Curriculum");

const createStage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const { stageNumber, name, description, defaultGithubRepo } = req.body;

        if (!stageNumber) {
            return res.status(400).json({
                message: "Stage number is required",
            });
        }

        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        });
        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        let existingStage = null;

        if (curriculum.stages) {
            existingStage = curriculum.stages.find(
                (stage) => stage.stageNumber === stageNumber
            );
        } else {
            curriculum.stages = [];
            existingStage = null;
        }
        if (existingStage) {
            return res.status(400).json({
                message: "A stage with this number already exists",
            });
        }

        const newStage = {
            stageNumber,
            name,
            description,
            defaultGithubRepo,
        };

        curriculum.stages.push(newStage);
        await curriculum.save();

        const createdStage = curriculum.stages[curriculum.stages.length - 1];

        res.status(201).json({
            message: "Stage created successfully",
            stage: createdStage,
        });
    } catch (error) {
        console.error("Create stage error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = createStage;
