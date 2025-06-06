const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, "Note type is required"],
            enum: {
                values: [
                    "reflection",
                    "todo",
                    "idea",
                    "bug",
                    "improvement",
                    "question",
                    "achievement",
                    "other",
                ],
                message: "Invalid note type",
            },
        },
        content: {
            type: String,
            required: [true, "Note content is required"],
            trim: true,
            maxlength: [5000, "Note content cannot exceed 5000 characters"],
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project reference is required"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Note", noteSchema);
