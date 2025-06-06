const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const config = require("./utils/config");

// Import routes
const userRoutes = require("./routes/userRoutes");
const curriculaRoutes = require("./routes/curriculaRoutes");
const projectRoutes = require("./routes/projectRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("view engine", "ejs");

// Session configuration
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.MONGODB_URI,
        }),
        cookie: {
            secure: config.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/curricula", curriculaRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", noteRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error:
            config.NODE_ENV === "development"
                ? err.message
                : "Internal server error",
    });
});

// 404 handler
app.use("/", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB and start server
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });
