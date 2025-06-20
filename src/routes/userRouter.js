const express = require("express");
const userControllers = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/users", userControllers.getUsers);
userRouter.get('/user/:id', userControllers.getSingleUser);
userRouter.delete('/user/:id', userControllers.deleteUser);

module.exports = userRouter;
