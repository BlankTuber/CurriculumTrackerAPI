const Note = require("../../models/Note");

const updateNote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { noteId } = req.params;
        const { type, content } = req.body;

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

        // Prepare update fields
        const updateFields = {};
        if (type !== undefined) updateFields.type = type;
        if (content !== undefined) updateFields.content = content;

        // Check if there's anything to update
        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({ message: "No valid fields to update" });
        }

        // Update note
        const updatedNote = await Note.findByIdAndUpdate(noteId, updateFields, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            message: "Note updated successfully",
            note: updatedNote,
        });
    } catch (error) {
        console.error("Update note error:", error);

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

module.exports = updateNote;
