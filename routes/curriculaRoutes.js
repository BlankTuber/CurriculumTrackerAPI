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
const getCurricula = require("../controllers/curricula/getCurricula");
const getResource = require("../controllers/curricula/getResource");

const router = express.Router();

// All curricula routes require authentication
router.use(authenticateUser);

// Curriculum management
router.post("/createCurriculum", createCurriculum);
router.put("/:curriculumId/updateCurriculum", updateCurriculum);
router.delete("/:curriculumId/deleteCurriculum", deleteCurriculum);
router.get("/:curriculumId", getCurriculum);
router.get("/", getCurricula);

// Resource management
router.post("/resource/:curriculumId/createResource", createResource);
router.put("/resource/:resourceId/updateResource", updateResource);
router.delete("/resource/:resourceId/deleteResource", deleteResource);
router.get("/resource/:resourceId", getResource);

module.exports = router;
