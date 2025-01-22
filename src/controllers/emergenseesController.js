const Emergensees = require("../models/Emergensees");

const emergenseesController = {
  createNew: async (req, res) => {
    try {
      const { author, name, number_of_injured, address, landmark, weather_condition, time_of_incident, type } = req.body;

      // Validate required fields
      if (!author || !name || !number_of_injured || !address || !landmark || !weather_condition || !time_of_incident || !type || !image) {
        res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
        return;
      }

      const cloudFile = await upload(req.body.image);

      // Create a new history record
      const newHistory = new History({
        image: cloudFile.secure_url,
        author,
        name,
        number_of_injured,
        address,
        landmark,
        weather_condition,
        time_of_incident,
        type
      });

      // Save the record to the database
      const savedHistory = await newHistory.save();

      if (type === 'fall') {
        savedHistory.height = req.body.height
        savedHistory.from_unto = req.body.from_unto
        savedHistory.surface = req.body.surface

        await savedHistory.save()
      }

      if (type === 'assault') {
        savedHistory.weapon = req.body.weapon
        savedHistory.body_part_injured = req.body.body_part_injured

        await savedHistory.save()
      }

      if (type === 'burn') {
        savedHistory.burn_type = req.body.burn_type
        savedHistory.body_part_injured = req.body.body_part_injured

        await savedHistory.save()
      }

      if (type === 'other') {
        savedHistory.incident_type = req.body.incident_type
        await savedHistory.save()
      }

      if (type === 'motor-vehicle') {
        savedHistory.vehicle = req.body.vehicle
        savedHistory.number_of_vehicles = req.body.number_of_vehicles

        await savedHistory.save()
      }


      res.status(201).json({
        success: true,
        message: "Emergensees created successfully.",
        data: savedHistory,
      });
    } catch (error) {
      console.error("Error creating history:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating history.",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      // Fetch all history records from the database
      const histories = await Emergensees.find();

      if (!histories || histories.length === 0) {
        res.status(404).json({
          success: false,
          message: "No Emergensees found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Emergensees fetched successfully.",
        data: histories,
      });
    } catch (error) {
      console.error("Error fetching Emergensees:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching Emergensees.",
      });
    }
  },

  getSingle: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Emergensee ID is required.",
        });
        return;
      }

      // Fetch a single history record by ID
      const history = await Emergensees.findById(id);

      if (!history) {
        res.status(404).json({
          success: false,
          message: "Emergensee not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Emergensee fetched successfully.",
        data: history,
      });
    } catch (error) {
      console.error("Error fetching single Emergensee:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching Emergensee.",
      });
    }
  },

  getHistory: async (req, res) => {
    try {
      const { author } = req.params;

      if (!author) {
        res.status(400).json({
          success: false,
          message: "Author parameter is required.",
        });
        return;
      }

      // Fetch history data by author
      const history = await Emergensees.find({ author });

      if (!history || history.length === 0) {
        res.status(404).json({
          success: false,
          message: "No Emergensee found for the given author.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Emergensee fetched successfully.",
        data: history,
      });
    } catch (error) {
      console.error("Error fetching Emergensee:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching Emergensee.",
      });
    }

  }
}
module.exports = emergenseesController