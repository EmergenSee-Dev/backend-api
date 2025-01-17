const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/utils/db");

// Load environment variables from .env file
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Import routes
const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");
const emergenseesRouter = require("./src/routes/emergenseesRouter");

app.use("/auth", authRouter);
app.use("/api", userRouter);
app.use("/api/emergensee", emergenseesRouter);


// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the Express App!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
