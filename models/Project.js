const mongoose = require("mongoose");
const validator = require("validator");

const projectResourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project resource name is required"],
            trim: true,
            maxlength: [
                100,
                "Project resource name cannot exceed 100 characters",
            ],
        },
        type: {
            type: String,
            required: [true, "Project resource type is required"],
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
                message: "Invalid project resource type",
            },
        },
        link: {
            type: String,
            required: [true, "Project resource link is required"],
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

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            maxlength: [100, "Project name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        githubLink: {
            type: String,
            required: [true, "GitHub link is required"],
            validate: {
                validator: function (v) {
                    return validator.isURL(v) && v.includes("github.com");
                },
                message: "Please provide a valid GitHub URL",
            },
        },
        completed: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
        stage: {
            type: Number,
            required: [true, "Stage is required"],
            min: [1, "Stage must be at least 1"],
        },
        prerequisites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        curriculum: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Curriculum",
            required: [true, "Curriculum reference is required"],
        },
        projectResources: [projectResourceSchema],
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note",
            },
        ],
    },
    {
        timestamps: true,
    }
);

projectSchema.index({ stage: 1 });
projectSchema.index({ order: 1 });
projectSchema.index({ curriculum: 1, stage: 1 });

module.exports = mongoose.model("Project", projectSchema);
