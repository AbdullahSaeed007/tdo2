const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const dbURI =
      process.env.NODE_ENV === "DEVELOPMENT"
        ? process.env.DB_LOCAL_URI
        : process.env.DB_ATLAS_URI;

    if (!dbURI) {
      throw new Error("Database URI is not defined. Check your environment variables.");
    }

    const conn = await mongoose.connect(dbURI); // No options needed
    console.log(`MongoDB connected successfully to HOST: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit on connection failure
  }
};

module.exports = connectDatabase;
