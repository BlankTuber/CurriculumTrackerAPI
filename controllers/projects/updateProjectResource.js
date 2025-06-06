const Project = require("../../models/Project");

const updateProjectResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectResourceId } = req.params;
        const { name, type, link } = req.body;

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

        // Update resource fields if provided
        if (name !== undefined) resource.name = name;
        if (type !== undefined) resource.type = type;
        if (link !== undefined) resource.link = link;

        // Save the project
        await project.save();

        res.status(200).json({
            message: "Project resource updated successfully",
            projectResource: resource,
        });
    } catch (error) {
        console.error("Update project resource error:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = updateProjectResource;
