const Curriculum = require("../../models/Curriculum");

const getResource = async (req, res) => {
    try {
        const userId = req.user._id;
        const { resourceId } = req.params;

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

        res.status(200).json({ resource });
    } catch (error) {
        console.error("Get resource error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getResource;
