const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  code: { type: String, required: false }
});

module.exports = mongoose.model("User", UserSchema);
