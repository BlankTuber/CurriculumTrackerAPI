const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const createProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const {
            name,
            description,
            githubLink,
            projectResources = [],
        } = req.body;

        // Validate required fields
        if (!name || !description || !githubLink) {
            return res.status(400).json({
                message: "Name, description, and GitHub link are required",
            });
        }

        // Verify curriculum exists and user owns it
        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        });
        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        // Create project
        const project = new Project({
            name,
            description,
            githubLink,
            curriculum: curriculumId,
            projectResources,
        });

        await project.save();

        // Add project to curriculum's projects array
        curriculum.projects.push(project._id);
        await curriculum.save();

        res.status(201).json({
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);

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

module.exports = createProject;
