const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");

// Import controllers
const login = require("../controllers/users/login");
const register = require("../controllers/users/register");
const updateUser = require("../controllers/users/updateUser");
const deleteUser = require("../controllers/users/deleteUser");
const getUser = require("../controllers/users/getUser");

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes
router.use(authenticateUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);
router.get("/", getUser);

module.exports = router;
