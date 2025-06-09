const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const getProjectsByStage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const { stage, level } = req.query;

        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        });
        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        let query = { curriculum: curriculumId };

        if (stage) {
            query.stage = parseInt(stage);
        } else if (level) {
            const levelObj = curriculum.levels.find(
                (l) => l._id.toString() === level
            );
            if (!levelObj) {
                return res.status(404).json({ message: "Level not found" });
            }
            query.stage = {
                $gte: levelObj.stageStart,
                $lte: levelObj.stageEnd,
            };
        }

        const projects = await Project.find(query)
            .populate("curriculum", "name owner")
            .populate({
                path: "notes",
                select: "type content createdAt updatedAt",
            })
            .populate("prerequisites", "name description completed stage")
            .sort({ stage: 1, order: 1 });

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found" });
        }

        res.status(200).json({ projects });
    } catch (error) {
        console.error("Get projects by stage error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getProjectsByStage;
