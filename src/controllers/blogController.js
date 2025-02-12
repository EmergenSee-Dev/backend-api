const Blog = require("../models/Blog");
const { uploadToCloudinary } = require("../utils/cloudinary");


const blogControllers = {
  // Get all blogs
  getBlogs: async (req, res) => {
    try {
      const blogs = await Blog.find();
      return res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create a new blog
  newBlog: async (req, res) => {
    try {
      const { title, content, description } = req.body;
      const image = req.file;

      // Validate required fields
      if (!image || !title || !content || !description) {
        return res.status(400).json({ success: false, message: "Image, title, description, and content are required." });
      }

      const cloudFile = await uploadToCloudinary(image);  // This will now work with buffers

      // Create the blog post
      const blog = await Blog.create({
        image: cloudFile.secure_url,
        title, content, description
      });
      return res.status(201).json({ success: true, data: blog });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Edit an existing blog
  editBlog: async (req, res) => {
    try {
      const { id } = req.params;
      // Update blog with new values coming from req.body.
      const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      return res.status(200).json({ success: true, data: blog });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get a single blog by its id
  singleBlog: async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      return res.status(200).json({ success: true, data: blog });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const { id } = req.params;
      // Find the blog by its ID and delete it.
      const deletedBlog = await Blog.findByIdAndDelete(id);
      if (!deletedBlog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found.'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Blog deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the blog.'
      });
    }
  }
};

module.exports = blogControllers;
