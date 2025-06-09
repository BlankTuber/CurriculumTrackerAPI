const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { validateObjectIds } = require("../utils/validateObjectIds");

const createCurriculum = require("../controllers/curricula/createCurriculum");
const updateCurriculum = require("../controllers/curricula/updateCurriculum");
const deleteCurriculum = require("../controllers/curricula/deleteCurriculum");
const createResource = require("../controllers/curricula/createResource");
const updateResource = require("../controllers/curricula/updateResource");
const deleteResource = require("../controllers/curricula/deleteResource");
const getCurriculum = require("../controllers/curricula/getCurriculum");
const getCurricula = require("../controllers/curricula/getCurricula");
const getResource = require("../controllers/curricula/getResource");
const createLevel = require("../controllers/curricula/createLevel");
const updateLevel = require("../controllers/curricula/updateLevel");
const deleteLevel = require("../controllers/curricula/deleteLevel");
const getLevel = require("../controllers/curricula/getLevel");

const router = express.Router();

router.use(authenticateUser);

router.post(
    "/level/:curriculumId/createLevel",
    validateObjectIds("curriculumId"),
    createLevel
);
router.put(
    "/level/:levelId/updateLevel",
    validateObjectIds("levelId"),
    updateLevel
);
router.delete(
    "/level/:levelId/deleteLevel",
    validateObjectIds("levelId"),
    deleteLevel
);
router.get("/level/:levelId", validateObjectIds("levelId"), getLevel);

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
