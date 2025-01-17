const mongoose = require("mongoose");

const VerifyUserSchema = new mongoose.Schema({
  phone: { type: Number, required: true },
  code: { type: String, required: true },
  verifiedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VerifyUser", VerifyUserSchema);
