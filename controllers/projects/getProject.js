const Project = require("../../models/Project");

const getProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate("curriculum", "name owner levels resources")
            .populate({
                path: "notes",
                select: "type content createdAt updatedAt",
            })
            .populate("prerequisites", "name description completed stage");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.curriculum.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error("Get project error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getProject;
