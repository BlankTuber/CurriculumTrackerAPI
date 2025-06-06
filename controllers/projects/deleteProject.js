const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");
const Note = require("../../models/Note");

const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;

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

        // Delete all notes associated with this project
        await Note.deleteMany({ project: projectId });

        // Remove project from curriculum's projects array
        await Curriculum.findByIdAndUpdate(project.curriculum._id, {
            $pull: { projects: projectId },
        });

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Delete project error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteProject;
