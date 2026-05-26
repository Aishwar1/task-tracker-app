const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timeLogRoutes = require("./routes/timeLogRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/timelog", timeLogRoutes);
app.use("/summary", summaryRoutes);

app.get("/", (req, res) => {
    res.send("API Running");
});

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected Route",
        user: req.user
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});