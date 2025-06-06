const Note = require("../../models/Note");
const Project = require("../../models/Project");

const createNote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;
        const { type, content } = req.body;

        // Validate required fields
        if (!type || !content) {
            return res
                .status(400)
                .json({ message: "Type and content are required for note" });
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

        // Create note
        const note = new Note({
            type,
            content,
            project: projectId,
        });

        await note.save();

        // Add note to project's notes array
        project.notes.push(note._id);
        await project.save();

        res.status(201).json({
            message: "Note created successfully",
            note,
        });
    } catch (error) {
        console.error("Create note error:", error);

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

module.exports = createNote;
