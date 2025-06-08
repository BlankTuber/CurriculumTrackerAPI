const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const getAllProjects = async (req, res) => {
    try {
        // Get all curricula owned by the user
        const userCurricula = await Curriculum.find({ owner: req.user._id });

        // Extract curriculum IDs
        const curriculumIds = userCurricula.map((curriculum) => curriculum._id);

        // Find all projects associated with these curricula
        const projects = await Project.find({
            curriculum: { $in: curriculumIds },
        })
            .populate("curriculum", "name")
            .populate("prerequisites", "name description completed")
            .sort({ order: 1 });

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
