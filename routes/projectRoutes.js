const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { validateObjectIds } = require("../utils/validateObjectIds");

const createProject = require("../controllers/projects/createProject");
const updateProject = require("../controllers/projects/updateProject");
const deleteProject = require("../controllers/projects/deleteProject");
const createProjectResource = require("../controllers/projects/createProjectResource");
const updateProjectResource = require("../controllers/projects/updateProjectResource");
const deleteProjectResource = require("../controllers/projects/deleteProjectResource");
const getProject = require("../controllers/projects/getProject");
const getProjectResource = require("../controllers/projects/getProjectResource");
const getAllProjects = require("../controllers/projects/getAllProjects");
const getProjectsByStage = require("../controllers/projects/getProjectsByStage");

const router = express.Router();

router.use(authenticateUser);

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
router.get(
    "/curriculum/:curriculumId/stage",
    validateObjectIds("curriculumId"),
    getProjectsByStage
);
router.get("/", getAllProjects);
router.get("/:projectId", validateObjectIds("projectId"), getProject);

module.exports = router;
