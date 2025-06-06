const Note = require("../../models/Note");
const Project = require("../../models/Project");

const deleteNote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { noteId } = req.params;

        // Find note and verify ownership through project and curriculum
        const note = await Note.findById(noteId).populate({
            path: "project",
            populate: {
                path: "curriculum",
                select: "owner",
            },
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Verify user owns the curriculum that contains the project that contains this note
        if (note.project.curriculum.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Remove note from project's notes array
        await Project.findByIdAndUpdate(note.project._id, {
            $pull: { notes: noteId },
        });

        // Delete the note
        await Note.findByIdAndDelete(noteId);

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteNote;
