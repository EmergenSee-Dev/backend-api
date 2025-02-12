const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Blog", BlogSchema);
