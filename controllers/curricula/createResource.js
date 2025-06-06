const Curriculum = require("../../models/Curriculum");

const createResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const { name, type, link } = req.body;

        // Validate required fields
        if (!name || !type || !link) {
            return res.status(400).json({
                message: "Name, type, and link are required for resource",
            });
        }

        // Find curriculum and verify ownership
        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        });
        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        // Create new resource
        const newResource = {
            name,
            type,
            link,
        };

        // Add resource to curriculum
        curriculum.resources.push(newResource);
        await curriculum.save();

        // Get the newly created resource
        const createdResource =
            curriculum.resources[curriculum.resources.length - 1];

        res.status(201).json({
            message: "Resource created successfully",
            resource: createdResource,
        });
    } catch (error) {
        console.error("Create resource error:", error);

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

module.exports = createResource;
