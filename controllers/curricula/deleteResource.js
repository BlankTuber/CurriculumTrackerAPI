const Curriculum = require("../../models/Curriculum");

const deleteResource = async (req, res) => {
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

        // Remove the resource
        curriculum.resources.pull({ _id: resourceId });
        await curriculum.save();

        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("Delete resource error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteResource;
