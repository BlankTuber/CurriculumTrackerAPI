const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");

// Import controllers
const createCurriculum = require("../controllers/curricula/createCurriculum");
const updateCurriculum = require("../controllers/curricula/updateCurriculum");
const deleteCurriculum = require("../controllers/curricula/deleteCurriculum");
const createResource = require("../controllers/curricula/createResource");
const updateResource = require("../controllers/curricula/updateResource");
const deleteResource = require("../controllers/curricula/deleteResource");
const getCurriculum = require("../controllers/curricula/getCurriculum");
const getResource = require("../controllers/curricula/getResource");

const router = express.Router();

// All curricula routes require authentication
router.use(authenticateUser);

// Curriculum management
router.post("/createCurriculum", createCurriculum);
router.put("/:curriculumId/updateCurriculum", updateCurriculum);
router.delete("/:curriculumId/deleteCurriculum", deleteCurriculum);
router.get("/:curriculumId", getCurriculum);

// Resource management
router.post("/:curriculumId/createResource", createResource);
router.put("/:resourceId/updateResource", updateResource);
router.delete("/:resourceId/deleteResource", deleteResource);
router.get("/:resourceId", getResource);

module.exports = router;
