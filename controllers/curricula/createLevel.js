const Curriculum = require("../../models/Curriculum");

const createLevel = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const { name, description, stageStart, stageEnd, order } = req.body;

        if (!name || !stageStart || !stageEnd || !order) {
            return res.status(400).json({
                message:
                    "Name, stage start, stage end, and order are required for level",
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

        const existingOrderLevel = curriculum.levels.find(
            (level) => level.order === order
        );
        if (existingOrderLevel) {
            return res.status(400).json({
                message: "A level with this order already exists",
            });
        }

        const overlappingLevel = curriculum.levels.find(
            (level) =>
                (stageStart >= level.stageStart &&
                    stageStart <= level.stageEnd) ||
                (stageEnd >= level.stageStart && stageEnd <= level.stageEnd) ||
                (stageStart <= level.stageStart && stageEnd >= level.stageEnd)
        );
        if (overlappingLevel) {
            return res.status(400).json({
                message: "Stage range overlaps with existing level",
            });
        }

        const newLevel = {
            name,
            description,
            stageStart,
            stageEnd,
            order,
        };

        curriculum.levels.push(newLevel);
        await curriculum.save();

        const createdLevel = curriculum.levels[curriculum.levels.length - 1];

        res.status(201).json({
            message: "Level created successfully",
            level: createdLevel,
        });
    } catch (error) {
        console.error("Create level error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = createLevel;
