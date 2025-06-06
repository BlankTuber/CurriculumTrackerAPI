const Curriculum = require("../../models/Curriculum");

const updateResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { resourceId } = req.params;
        const { name, type, link } = req.body;

        // Find curriculum containing the resource and verify ownership
        const curriculum = await Curriculum.findOne({
            owner: userId,
            "resources._id": resourceId,
        });

        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Resource not found or access denied" });
        }

        // Find the specific resource
        const resource = curriculum.resources.id(resourceId);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Update resource fields if provided
        if (name !== undefined) resource.name = name;
        if (type !== undefined) resource.type = type;
        if (link !== undefined) resource.link = link;

        // Save the curriculum
        await curriculum.save();

        res.status(200).json({
            message: "Resource updated successfully",
            resource,
        });
    } catch (error) {
        console.error("Update resource error:", error);

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

module.exports = updateResource;
