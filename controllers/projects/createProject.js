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
            order,
            prerequisites = [],
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

        // If no order provided, set to next available order
        let projectOrder = order;
        if (projectOrder === undefined) {
            const existingProjects = await Project.find({
                curriculum: curriculumId,
            });
            const maxOrder = existingProjects.reduce(
                (max, project) => Math.max(max, project.order || 0),
                0
            );
            projectOrder = maxOrder + 1;
        }

        // Validate prerequisites if provided
        if (prerequisites.length > 0) {
            const prerequisiteProjects = await Project.find({
                _id: { $in: prerequisites },
            }).populate("curriculum");

            if (prerequisiteProjects.length !== prerequisites.length) {
                return res.status(400).json({
                    message: "One or more prerequisite projects not found",
                });
            }

            // Verify all prerequisites belong to curricula owned by this user
            const invalidPrerequisites = prerequisiteProjects.filter(
                (project) =>
                    project.curriculum.owner.toString() !== userId.toString()
            );
            if (invalidPrerequisites.length > 0) {
                return res.status(403).json({
                    message:
                        "Access denied to one or more prerequisite projects",
                });
            }
        }

        // Create project
        const project = new Project({
            name,
            description,
            githubLink,
            curriculum: curriculumId,
            projectResources,
            order: projectOrder,
            prerequisites,
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
