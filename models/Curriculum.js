const mongoose = require("mongoose");
const validator = require("validator");

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Resource name is required"],
            trim: true,
            maxlength: [100, "Resource name cannot exceed 100 characters"],
        },
        type: {
            type: String,
            required: [true, "Resource type is required"],
            enum: {
                values: [
                    "documentation",
                    "theory",
                    "book",
                    "online resource",
                    "video",
                    "tutorial",
                    "article",
                    "other",
                ],
                message: "Invalid resource type",
            },
        },
        link: {
            type: String,
            required: [true, "Resource link is required"],
            validate: {
                validator: function (v) {
                    return validator.isURL(v);
                },
                message: "Please provide a valid URL",
            },
        },
    },
    {
        timestamps: true,
    }
);

const curriculumSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Curriculum name is required"],
            trim: true,
            maxlength: [100, "Curriculum name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner is required"],
        },
        resources: [resourceSchema],
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Curriculum", curriculumSchema);
