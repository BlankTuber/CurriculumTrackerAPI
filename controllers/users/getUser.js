const User = require("../../models/User");
const Curriculum = require("../../models/Curriculum");
const Project = require("../../models/Project");
const Note = require("../../models/Note");

const getUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const curricula = await Curriculum.find({ owner: userId });
        const curriculumIds = curricula.map((curriculum) => curriculum._id);

        const projects = await Project.find({
            curriculum: { $in: curriculumIds },
        });

        const projectIds = projects.map((project) => project._id);
        const notesCount = await Note.countDocuments({
            project: { $in: projectIds },
        });

        const projectsByState = projects.reduce((acc, project) => {
            acc[project.state] = (acc[project.state] || 0) + 1;
            return acc;
        }, {});

        const curriculumResourcesCount = curricula.reduce((acc, curriculum) => {
            return (
                acc + (curriculum.resources ? curriculum.resources.length : 0)
            );
        }, 0);

        const projectResourcesCount = projects.reduce((acc, project) => {
            return (
                acc +
                (project.projectResources ? project.projectResources.length : 0)
            );
        }, 0);

        const levelsCount = curricula.reduce((acc, curriculum) => {
            return acc + (curriculum.levels ? curriculum.levels.length : 0);
        }, 0);

        const stagesCount = curricula.reduce((acc, curriculum) => {
            return acc + (curriculum.stages ? curriculum.stages.length : 0);
        }, 0);

        const completionPercentage =
            projects.length > 0
                ? Math.round(
                      ((projectsByState.completed || 0) / projects.length) * 100
                  )
                : 0;

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                githubUsername: user.githubUsername,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            stats: {
                curriculaCount: curricula.length,
                totalProjects: projects.length,
                completedProjects: projectsByState.completed || 0,
                inProgressProjects: projectsByState.in_progress || 0,
                notStartedProjects: projectsByState.not_started || 0,
                totalNotes: notesCount,
                totalLevels: levelsCount,
                totalStages: stagesCount,
                totalResources:
                    curriculumResourcesCount + projectResourcesCount,
                completionPercentage,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getUser;
