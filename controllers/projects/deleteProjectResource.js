const Project = require("../../models/Project");

const deleteProjectResource = async (req, res) => {
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

        // Remove the resource
        project.projectResources.pull({ _id: projectResourceId });
        await project.save();

        res.status(200).json({
            message: "Project resource deleted successfully",
        });
    } catch (error) {
        console.error("Delete project resource error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteProjectResource;
