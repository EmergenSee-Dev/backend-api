const express = require("express");
const authControllers = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/create", authControllers.createUser);
authRouter.post("/login", authControllers.loginUser);
authRouter.put('/verify-code', authControllers.verifyOtp)
authRouter.put('/start-verification', authControllers.createVerification)


module.exports = authRouter;
