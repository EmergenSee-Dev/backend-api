const express = require("express");
const authControllers = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/create", authControllers.createUser);
userRouter.post("/login", authControllers.loginUser);


module.exports = userRouter;
