const User = require("../models/User");

const userControllers = {
  getUsers: async (req, res) => {
    try {
      // Fetch all users
      const users = await User.find().select('-password'); // Adjust this query based on your ORM/DB structure

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching users.",
      });
    }
  },
  getSingleUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch a single user by ID
      const user = await User.findById(id).select('-password'); // Replace with your ORM's method to fetch by ID

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);

      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the user.",
      });
    }
  }
}

module.exports = userControllers