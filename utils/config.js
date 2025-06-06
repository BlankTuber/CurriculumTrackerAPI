require("dotenv").config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI:
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/curriculum-manager",
    SESSION_SECRET: process.env.SESSION_SECRET || "fallback-secret-change-this",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

// Validate required environment variables in production
if (config.NODE_ENV === "production") {
    const requiredEnvVars = ["MONGODB_URI", "SESSION_SECRET"];
    const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
        console.error(
            "Missing required environment variables:",
            missingEnvVars
        );
        process.exit(1);
    }
}

module.exports = config;
