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

module.exports = mongoose.model("Curriculum", curriculumSchema);
