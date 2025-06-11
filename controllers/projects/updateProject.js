const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const updateProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectId } = req.params;
        const {
            name,
            description,
            identifier,
            topics,
            githubRepo,
            state,
            order,
            stage,
            prerequisites,
        } = req.body;

        const project = await Project.findById(projectId).populate(
            "curriculum"
        );
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.curriculum.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (identifier !== undefined) {
            if (identifier && identifier !== project.identifier) {
                const existingProject = await Project.findOne({
                    curriculum: project.curriculum._id,
                    identifier: identifier,
                    _id: { $ne: projectId },
                });
                if (existingProject) {
                    return res.status(400).json({
                        message:
                            "A project with this identifier already exists in the curriculum",
                    });
                }
            }
            updateFields.identifier = identifier;
        }
        if (topics !== undefined) updateFields.topics = topics;
        if (state !== undefined) updateFields.state = state;
        if (order !== undefined) updateFields.order = order;
        if (stage !== undefined) updateFields.stage = stage;

        if (githubRepo !== undefined) {
            updateFields.githubRepo = githubRepo;
        } else if (stage !== undefined && stage !== project.stage) {
            const curriculum = await Curriculum.findById(
                project.curriculum._id
            );
            const stageDefinition = curriculum.stages.find(
                (s) => s.stageNumber === stage
            );
            if (
                stageDefinition &&
                stageDefinition.defaultGithubRepo &&
                !project.githubRepo
            ) {
                updateFields.githubRepo = stageDefinition.defaultGithubRepo;
            }
        }

        if (prerequisites !== undefined) {
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
                        project.curriculum.owner.toString() !==
                        userId.toString()
                );
                if (invalidPrerequisites.length > 0) {
                    return res.status(403).json({
                        message:
                            "Access denied to one or more prerequisite projects",
                    });
                }
            }
            updateFields.prerequisites = prerequisites;
        }

        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({ message: "No valid fields to update" });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updateFields,
            { new: true, runValidators: true }
        )
            .populate("curriculum", "name owner levels stages")
            .populate({
                path: "notes",
                select: "type content createdAt updatedAt",
            })
            .populate(
                "prerequisites",
                "name description identifier state stage"
            );

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Update project error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = updateProject;
