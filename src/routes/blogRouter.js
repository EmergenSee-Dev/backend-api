const express = require("express");
const blogControllers = require("../controllers/blogController");
const blogRouter = express.Router();
const multer = require('multer');
const upload = multer();

blogRouter.get("/", blogControllers.getBlogs);
blogRouter.post("/new", upload.single('image'), blogControllers.newBlog);
blogRouter.put("/edit/:id", blogControllers.editBlog);
blogRouter.get('/:id', blogControllers.singleBlog)
blogRouter.delete('/:id', blogControllers.deleteBlog)

module.exports = blogRouter;
