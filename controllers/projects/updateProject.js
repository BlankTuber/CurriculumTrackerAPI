const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const updateProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;
        const {
            name,
            description,
            githubLink,
            completed,
            order,
            prerequisites,
        } = req.body;

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

        // Prepare update fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (githubLink !== undefined) updateFields.githubLink = githubLink;
        if (completed !== undefined) updateFields.completed = completed;
        if (order !== undefined) updateFields.order = order;

        // Validate prerequisites if provided
        if (prerequisites !== undefined) {
            if (prerequisites.length > 0) {
                const prerequisiteProjects = await Project.find({
                    _id: { $in: prerequisites },
                }).populate("curriculum");

                if (prerequisiteProjects.length !== prerequisites.length) {
                    return res.status(400).json({
                        message: "One or more prerequisite projects not found",
                    });
                }

                // Verify all prerequisites belong to curricula owned by this user
                const invalidPrerequisites = prerequisiteProjects.filter(
                    (project) =>
                        project.curriculum.owner.toString() !==
                        userId.toString()
                );
                if (invalidPrerequisites.length > 0) {
                    return res.status(403).json({
                        message:
                            "Access denied to one or more prerequisite projects",
                    });
                }
            }
            updateFields.prerequisites = prerequisites;
        }

        // Check if there's anything to update
        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({ message: "No valid fields to update" });
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updateFields,
            { new: true, runValidators: true }
        )
            .populate("notes")
            .populate("prerequisites", "name");

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Update project error:", error);

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

module.exports = updateProject;
