const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/Database");
const path = require("path");
const taskRoutes = require("./routes/Task");
const colRoutes = require("./routes/Column");
const authRoutes = require("./routes/Auth");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

dotenv.config({ path: "config/config.env" });
connectDatabase();
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://13.61.107.145",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/v1", taskRoutes);
app.use("/api/v1", colRoutes);
app.use("/api/v1", authRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong! (App)", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port: ${PORT}`);
});

module.exports = app;
