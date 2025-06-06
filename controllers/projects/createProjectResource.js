const Project = require("../../models/Project");

const createProjectResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;
        const { name, type, link } = req.body;

        // Validate required fields
        if (!name || !type || !link) {
            return res.status(400).json({
                message:
                    "Name, type, and link are required for project resource",
            });
        }

        // Find project and verify ownership through curriculum
        const project = await Project.findById(projectId).populate(
            "curriculum"
        );
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify user owns the curriculum that contains this project
        if (project.curriculum.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Create new project resource
        const newProjectResource = {
            name,
            type,
            link,
        };

        // Add resource to project
        project.projectResources.push(newProjectResource);
        await project.save();

        // Get the newly created resource
        const createdResource =
            project.projectResources[project.projectResources.length - 1];

        res.status(201).json({
            message: "Project resource created successfully",
            projectResource: createdResource,
        });
    } catch (error) {
        console.error("Create project resource error:", error);

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

module.exports = createProjectResource;
