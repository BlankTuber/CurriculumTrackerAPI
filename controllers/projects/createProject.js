const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const createProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { curriculumId } = req.params;
        const {
            name,
            description,
            identifier,
            topics = [],
            githubRepo,
            projectResources = [],
            order,
            stage,
            state = "not_started",
            prerequisites = [],
        } = req.body;

        if (!name || !description || !stage) {
            return res.status(400).json({
                message: "Name, description, and stage are required",
            });
        }

        const curriculum = await Curriculum.findOne({
            _id: curriculumId,
            owner: userId,
        });
        if (!curriculum) {
            return res
                .status(404)
                .json({ message: "Curriculum not found or access denied" });
        }

        if (identifier) {
            const existingProject = await Project.findOne({
                curriculum: curriculumId,
                identifier: identifier,
            });
            if (existingProject) {
                return res.status(400).json({
                    message:
                        "A project with this identifier already exists in the curriculum",
                });
            }
        }

        let projectOrder = order;
        if (projectOrder === undefined) {
            const existingProjects = await Project.find({
                curriculum: curriculumId,
                stage: stage,
            });
            const maxOrder = existingProjects.reduce(
                (max, project) => Math.max(max, project.order || 0),
                0
            );
            projectOrder = maxOrder + 1;
        }

        if (prerequisites.length > 0) {
            const prerequisiteProjects = await Project.find({
                _id: { $in: prerequisites },
            }).populate("curriculum");

            if (prerequisiteProjects.length !== prerequisites.length) {
                return res.status(400).json({
                    message: "One or more prerequisite projects not found",
                });
            }

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

        let finalGithubRepo = githubRepo;
        if (!finalGithubRepo) {
            const stageDefinition = curriculum.stages.find(
                (s) => s.stageNumber === stage
            );
            if (stageDefinition && stageDefinition.defaultGithubRepo) {
                finalGithubRepo = stageDefinition.defaultGithubRepo;
            }
        }

        const project = new Project({
            name,
            description,
            identifier,
            topics,
            githubRepo: finalGithubRepo,
            curriculum: curriculumId,
            projectResources,
            order: projectOrder,
            stage,
            state,
            prerequisites,
        });

        await project.save();

        curriculum.projects.push(project._id);
        await curriculum.save();

        res.status(201).json({
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);

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
