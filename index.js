const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/utils/db");

// Load environment variables from .env file
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.json()); // Parse JSON bodies

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Handle preflight requests
  }

  next();
});

// Import routes
const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");
const emergenseesRouter = require("./src/routes/emergenseesRouter");
const blogRouter = require("./src/routes/blogRouter");

app.use("/auth", authRouter);
app.use("/api", userRouter);
app.use("/api/blogs", blogRouter);

app.use("/api/emergensee", emergenseesRouter);


// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the Emergensee App!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
