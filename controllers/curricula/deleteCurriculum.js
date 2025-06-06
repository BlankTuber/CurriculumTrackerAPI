const Curriculum = require("../../models/Curriculum");
const Project = require("../../models/Project");
const Note = require("../../models/Note");

const deleteCurriculum = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;

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

        // Get all project IDs associated with this curriculum
        const projectIds = curriculum.projects;

        // Delete all notes associated with the curriculum's projects
        if (projectIds.length > 0) {
            await Note.deleteMany({ project: { $in: projectIds } });
        }

        // Delete all projects associated with the curriculum
        if (projectIds.length > 0) {
            await Project.deleteMany({ _id: { $in: projectIds } });
        }

        // Delete the curriculum
        await Curriculum.findByIdAndDelete(curriculumId);

        res.status(200).json({ message: "Curriculum deleted successfully" });
    } catch (error) {
        console.error("Delete curriculum error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteCurriculum;
