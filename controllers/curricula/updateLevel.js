const Curriculum = require("../../models/Curriculum");

const updateLevel = async (req, res) => {
    try {
        const userId = req.user._id;
        const { levelId } = req.params;
        const {
            name,
            description,
            defaultIdentifier,
            stageStart,
            stageEnd,
            order,
        } = req.body;

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

        if (order !== undefined && order !== level.order) {
            const existingOrderLevel = curriculum.levels.find(
                (l) => l._id.toString() !== levelId && l.order === order
            );
            if (existingOrderLevel) {
                return res.status(400).json({
                    message: "A level with this order already exists",
                });
            }
        }

        if (
            (stageStart !== undefined && stageStart !== level.stageStart) ||
            (stageEnd !== undefined && stageEnd !== level.stageEnd)
        ) {
            const newStageStart =
                stageStart !== undefined ? stageStart : level.stageStart;
            const newStageEnd =
                stageEnd !== undefined ? stageEnd : level.stageEnd;

            const overlappingLevel = curriculum.levels.find(
                (l) =>
                    l._id.toString() !== levelId &&
                    ((newStageStart >= l.stageStart &&
                        newStageStart <= l.stageEnd) ||
                        (newStageEnd >= l.stageStart &&
                            newStageEnd <= l.stageEnd) ||
                        (newStageStart <= l.stageStart &&
                            newStageEnd >= l.stageEnd))
            );
            if (overlappingLevel) {
                return res.status(400).json({
                    message: "Stage range overlaps with existing level",
                });
            }
        }

        if (name !== undefined) level.name = name;
        if (description !== undefined) level.description = description;
        if (defaultIdentifier !== undefined)
            level.defaultIdentifier = defaultIdentifier;
        if (stageStart !== undefined) level.stageStart = stageStart;
        if (stageEnd !== undefined) level.stageEnd = stageEnd;
        if (order !== undefined) level.order = order;

        await curriculum.save();

        res.status(200).json({
            message: "Level updated successfully",
            level,
        });
    } catch (error) {
        console.error("Update level error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = updateLevel;
