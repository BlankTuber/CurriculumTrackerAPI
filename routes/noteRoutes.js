const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");

// Import controllers
const createNote = require("../controllers/notes/createNote");
const updateNote = require("../controllers/notes/updateNote");
const deleteNote = require("../controllers/notes/deleteNote");
const getNote = require("../controllers/notes/getNote");

const router = express.Router();

// All note routes require authentication
router.use(authenticateUser);

// Note management
router.post("/:projectId/createNote", createNote);
router.put("/:noteId/updateNote", updateNote);
router.delete("/:noteId/deleteNote", deleteNote);
router.get("/:noteId", getNote);

module.exports = router;
