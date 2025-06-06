const Project = require("../../models/Project");
const Curriculum = require("../../models/Curriculum");

const getAllProjects = async (req, res) => {
    try {
        // Get all curricula owned by the user
        const userCurricula = await Curriculum.find({ owner: req.user._id });
        
        // Extract curriculum IDs
        const curriculumIds = userCurricula.map(curriculum => curriculum._id);
        
        // Find all projects associated with these curricula
        const projects = await Project.find({
            curriculum: { $in: curriculumIds }
        }).populate('curriculum', 'name');

        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = getAllProjects;

