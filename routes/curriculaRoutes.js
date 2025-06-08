const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { validateObjectIds } = require("../utils/validateObjectIds");

// Import controllers
const createCurriculum = require("../controllers/curricula/createCurriculum");
const updateCurriculum = require("../controllers/curricula/updateCurriculum");
const deleteCurriculum = require("../controllers/curricula/deleteCurriculum");
const createResource = require("../controllers/curricula/createResource");
const updateResource = require("../controllers/curricula/updateResource");
const deleteResource = require("../controllers/curricula/deleteResource");
const getCurriculum = require("../controllers/curricula/getCurriculum");
const getCurricula = require("../controllers/curricula/getCurricula");
const getResource = require("../controllers/curricula/getResource");

const router = express.Router();

// All curricula routes require authentication
router.use(authenticateUser);

// RESOURCE ROUTES
router.post(
    "/resource/:curriculumId/createResource",
    validateObjectIds("curriculumId"),
    createResource
);
router.put(
    "/resource/:resourceId/updateResource",
    validateObjectIds("resourceId"),
    updateResource
);
router.delete(
    "/resource/:resourceId/deleteResource",
    validateObjectIds("resourceId"),
    deleteResource
);
router.get(
    "/resource/:resourceId",
    validateObjectIds("resourceId"),
    getResource
);

// CURRICULUM ROUTES
router.post("/createCurriculum", createCurriculum);
router.put(
    "/:curriculumId/updateCurriculum",
    validateObjectIds("curriculumId"),
    updateCurriculum
);
router.delete(
    "/:curriculumId/deleteCurriculum",
    validateObjectIds("curriculumId"),
    deleteCurriculum
);
router.get("/", getCurricula);
router.get("/:curriculumId", validateObjectIds("curriculumId"), getCurriculum);

module.exports = router;
