const Curriculum = require("../../models/Curriculum");

const updateCurriculum = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const { name, description } = req.body;

        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        });
        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;

        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({ message: "No valid fields to update" });
        }

        const updatedCurriculum = await Curriculum.findByIdAndUpdate(
            curriculumId,
            updateFields,
            { new: true, runValidators: true }
        ).populate({
            path: "projects",
            select: "name description identifier topics githubRepo state stage order createdAt updatedAt",
        });

        res.status(200).json({
            message: "Curriculum updated successfully",
            curriculum: updatedCurriculum,
        });
    } catch (error) {
        console.error("Update curriculum error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = updateCurriculum;
