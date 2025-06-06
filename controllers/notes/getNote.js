const Note = require("../../models/Note");

const getNote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { noteId } = req.params;

        // Find note and verify ownership through project and curriculum
        const note = await Note.findById(noteId).populate({
            path: "project",
            select: "name curriculum",
            populate: {
                path: "curriculum",
                select: "name owner",
            },
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Verify user owns the curriculum that contains the project that contains this note
        if (note.project.curriculum.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ note });
    } catch (error) {
        console.error("Get note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getNote;
