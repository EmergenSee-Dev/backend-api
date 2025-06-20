const User = require("../models/User");

const userControllers = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
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
      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
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
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found.' 
        });
      }
      res.status(200).json({ 
        success: true,
        message: 'User deleted successfully.', 
        data: user 
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ 
        success: false,
        message: 'An error occurred while deleting the user.' 
      });
    }
  }
};

module.exports = userControllers;
