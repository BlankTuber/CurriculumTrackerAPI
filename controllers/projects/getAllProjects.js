const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const getAllProjects = async (req, res) => {
    try {
        const userCurricula = await Curriculum.find({ owner: req.user._id });

        const curriculumIds = userCurricula.map((curriculum) => curriculum._id);

        const projects = await Project.find({
            curriculum: { $in: curriculumIds },
        })
            .populate("curriculum", "name owner")
            .populate(
                "prerequisites",
                "name description identifier state stage"
            )
            .sort({ stage: 1, order: 1 });

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found" });
        }

        res.status(200).json({ projects });
    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getAllProjects;
