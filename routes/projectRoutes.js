const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");

// Import controllers
const createProject = require("../controllers/projects/createProject");
const updateProject = require("../controllers/projects/updateProject");
const deleteProject = require("../controllers/projects/deleteProject");
const createProjectResource = require("../controllers/projects/createProjectResource");
const updateProjectResource = require("../controllers/projects/updateProjectResource");
const deleteProjectResource = require("../controllers/projects/deleteProjectResource");
const getProject = require("../controllers/projects/getProject");
const getProjectResource = require("../controllers/projects/getProjectResource");
const getAllProjects = require("../controllers/projects/getAllProjects");

const router = express.Router();

// All project routes require authentication
router.use(authenticateUser);

// Project management
router.post("/:curriculumId/createProject", createProject);
router.put("/:projectId/updateProject", updateProject);
router.delete("/:projectId/deleteProject", deleteProject);
router.get("/:projectId", getProject);
router.get("/", getAllProjects);

// Project resource management
router.post("/:projectId/createProjectResource", createProjectResource);
router.put("/:projectResourceId/updateProjectResource", updateProjectResource);
router.delete(
    "/:projectResourceId/deleteProjectResource",
    deleteProjectResource
);
router.get("/:projectResourceId", getProjectResource);

module.exports = router;
