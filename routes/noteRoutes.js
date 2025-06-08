const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { validateObjectIds } = require("../utils/validateObjectIds");

const createNote = require("../controllers/notes/createNote");
const updateNote = require("../controllers/notes/updateNote");
const deleteNote = require("../controllers/notes/deleteNote");
const getNote = require("../controllers/notes/getNote");

const router = express.Router();

router.use(authenticateUser);

// NOTE ROUTES
router.post(
    "/:projectId/createNote",
    validateObjectIds("projectId"),
    createNote
);
router.put("/:noteId/updateNote", validateObjectIds("noteId"), updateNote);
router.delete("/:noteId/deleteNote", validateObjectIds("noteId"), deleteNote);
router.get("/:noteId", validateObjectIds("noteId"), getNote);

module.exports = router;
