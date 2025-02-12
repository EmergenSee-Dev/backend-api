const mongoose = require("mongoose");

const EmergenseesSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  number_of_injured: { type: Number, required: true },
  address: { type: String, required: true },
  landmark: { type: String, required: true },
  weather_condition: { type: String, required: true },
  time_of_incident: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, required: true },

  height: { type: String, required: false },
  from_unto: { type: String, required: false },
  surface: { type: String, required: false },
  weapon: { type: String, required: false },
  body_part_injured: { type: String, required: false },
  burn_type: { type: String, required: false },
  vehicle: { type: String, required: false },
  number_of_vehicles: { type: Number, required: false },
  incident_type: { type: String, required: false },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = mongoose.model("Emergensees", EmergenseesSchema);
