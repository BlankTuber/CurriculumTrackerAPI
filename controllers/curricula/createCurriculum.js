const Curriculum = require("../../models/Curriculum");

const createCurriculum = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, description, resources = [] } = req.body;

        // Validate required fields
        if (!name) {
            return res
                .status(400)
                .json({ message: "Curriculum name is required" });
        }

        // Create curriculum
        const curriculum = new Curriculum({
            name,
            description,
            owner: userId,
            resources,
        });

        await curriculum.save();

        res.status(201).json({
            message: "Curriculum created successfully",
            curriculum,
        });
    } catch (error) {
        console.error("Create curriculum error:", error);

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

module.exports = createCurriculum;
