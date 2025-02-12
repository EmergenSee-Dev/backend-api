const Emergensees = require("../models/Emergensees");
const { uploadToCloudinary } = require("../utils/cloudinary");

const emergenseesController = {
  createNew: async (req, res) => {
    try {
      const {
        author,
        name,
        number_of_injured,
        address,
        landmark,
        weather_condition,
        time_of_incident,
        type,
        description
      } = req.body;
      const image = req.file;

      // Convert number_of_injured to a number
      const numInjured = Number(number_of_injured);

      // Validate required fields
      if (!author || !name || !number_of_injured || !address || !landmark || !weather_condition || !time_of_incident || !type || !image || !description) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      // Upload image to Cloudinary
      const cloudFile = await uploadToCloudinary(image);  // This will now work with buffers
      // console.log(cloudFile);  // Log the uploaded file details


      // Create a new history record
      const newHistory = new Emergensees({
        image: cloudFile.secure_url,
        author,
        name,
        number_of_injured: numInjured,
        address,
        landmark,
        weather_condition,
        time_of_incident,
        type,
        description
      });

      // Add additional fields based on type
      switch (type) {
        case "fall":
          newHistory.height = req.body.height;
          newHistory.from_unto = req.body.from_unto;
          newHistory.surface = req.body.surface;
          break;

        case "assault":
          newHistory.weapon = req.body.weapon;
          newHistory.body_part_injured = req.body.body_part_injured;
          break;

        case "burn":
          newHistory.burn_type = req.body.burn_type;
          newHistory.body_part_injured = req.body.body_part_injured;
          break;

        case "motor-vehicle":
          newHistory.vehicle = req.body.vehicle;
          newHistory.number_of_vehicles = req.body.number_of_vehicles;
          break;

        case "other":
          newHistory.incident_type = req.body.incident_type;
          break;
      }

      // Save the record only once
      const savedHistory = await newHistory.save();

      res.status(201).json({
        success: true,
        message: "Emergensees created successfully.",
        data: savedHistory,
      });
    } catch (error) {
      console.error("Error creating Emergensees:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating Emergensees.",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      // Build a query object; if a type filter is provided, add it to the query.
      const query = {};
      if (req.query.type) {
        query.type = req.query.type;
      }

      // Fetch histories with the applied filter (if any)
      const histories = await Emergensees.find(query)
        .populate({ path: 'author', select: "name _id" })
        .lean();

      if (!histories || histories.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Emergensees found.",
        });
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
      const history = await Emergensees.findById(id).populate({ path: 'author', select: "name _id" }).lean()

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
      const history = await Emergensees.find({ author }).populate({ path: 'author', select: "name _id" }).lean()

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