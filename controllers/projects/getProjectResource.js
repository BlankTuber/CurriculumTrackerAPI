const Project = require("../../models/Project");

const getProjectResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectResourceId } = req.params;

        // Find project containing the resource and verify ownership
        const project = await Project.findOne({
            "projectResources._id": projectResourceId,
        }).populate("curriculum");

        if (!project) {
            return res
                .status(404)
                .json({ message: "Project resource not found" });
        }

        // Verify user owns the curriculum that contains this project
        if (project.curriculum.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Find the specific resource
        const resource = project.projectResources.id(projectResourceId);
        if (!resource) {
            return res
                .status(404)
                .json({ message: "Project resource not found" });
        }

        res.status(200).json({ projectResource: resource });
    } catch (error) {
        console.error("Get project resource error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getProjectResource;
