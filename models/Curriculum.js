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

const levelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Level name is required"],
            trim: true,
            maxlength: [100, "Level name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Level description cannot exceed 500 characters"],
        },
        defaultIdentifier: {
            type: String,
            trim: true,
            maxlength: [10, "Default identifier cannot exceed 10 characters"],
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return /^[a-zA-Z0-9_-]+$/.test(v);
                },
                message:
                    "Default identifier can only contain letters, numbers, underscores, and hyphens",
            },
        },
        stageStart: {
            type: Number,
            required: [true, "Stage start is required"],
            min: [1, "Stage start must be at least 1"],
        },
        stageEnd: {
            type: Number,
            required: [true, "Stage end is required"],
            min: [1, "Stage end must be at least 1"],
            validate: {
                validator: function (v) {
                    return v >= this.stageStart;
                },
                message:
                    "Stage end must be greater than or equal to stage start",
            },
        },
        order: {
            type: Number,
            required: [true, "Level order is required"],
            min: [1, "Level order must be at least 1"],
        },
    },
    {
        timestamps: true,
    }
);

const stageSchema = new mongoose.Schema(
    {
        stageNumber: {
            type: Number,
            required: [true, "Stage number is required"],
            min: [1, "Stage number must be at least 1"],
        },
        name: {
            type: String,
            trim: true,
            maxlength: [100, "Stage name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Stage description cannot exceed 500 characters"],
        },
        defaultGithubRepo: {
            type: String,
            trim: true,
            maxlength: [
                100,
                "Default GitHub repo cannot exceed 100 characters",
            ],
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return /^[a-zA-Z0-9._-]+$/.test(v);
                },
                message: "Repository name contains invalid characters",
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
        levels: [levelSchema],
        stages: [stageSchema],
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

curriculumSchema.index({ "levels.order": 1 });
curriculumSchema.index({ "levels.stageStart": 1, "levels.stageEnd": 1 });
curriculumSchema.index({ "stages.stageNumber": 1 });

module.exports = mongoose.model("Curriculum", curriculumSchema);
