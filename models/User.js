const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters long"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9_]+$/.test(v);
                },
                message:
                    "Username can only contain letters, numbers, and underscores",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        githubUsername: {
            type: String,
            trim: true,
            maxlength: [39, "GitHub username cannot exceed 39 characters"],
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(v);
                },
                message: "Invalid GitHub username format",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
