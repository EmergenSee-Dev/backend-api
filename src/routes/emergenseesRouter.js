const express = require("express");
const emergenseesController = require("../controllers/emergenseesController");
const emergenseesRouter = express.Router();
const multer = require('multer');
const upload = multer();

emergenseesRouter.post("/create", upload.single('image'), emergenseesController.createNew);
emergenseesRouter.get('/all', emergenseesController.getAll)
emergenseesRouter.get('/single/:id', emergenseesController.getSingle)
emergenseesRouter.get('/user/:author', emergenseesController.getHistory)

module.exports = emergenseesRouter;
