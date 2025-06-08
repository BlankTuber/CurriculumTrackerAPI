const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { validateObjectIds } = require("../utils/validateObjectIds");

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

// PROJECT RESOURCE ROUTES
router.post(
    "/resource/:projectId/createProjectResource",
    validateObjectIds("projectId"),
    createProjectResource
);
router.put(
    "/resource/:projectResourceId/updateProjectResource",
    validateObjectIds("projectResourceId"),
    updateProjectResource
);
router.delete(
    "/resource/:projectResourceId/deleteProjectResource",
    validateObjectIds("projectResourceId"),
    deleteProjectResource
);
router.get(
    "/resource/:projectResourceId",
    validateObjectIds("projectResourceId"),
    getProjectResource
);

// PROJECT ROUTES
router.post(
    "/:curriculumId/createProject",
    validateObjectIds("curriculumId"),
    createProject
);
router.put(
    "/:projectId/updateProject",
    validateObjectIds("projectId"),
    updateProject
);
router.delete(
    "/:projectId/deleteProject",
    validateObjectIds("projectId"),
    deleteProject
);
router.get("/", getAllProjects);
router.get("/:projectId", validateObjectIds("projectId"), getProject);

module.exports = router;
