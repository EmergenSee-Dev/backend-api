const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const VerifyUser = require("../models/VerifyUser");
const { generateVerificationCode } = require("../utils/generateVerificationCode");
const { sendSms } = require("../utils/sendOtp");

// Create a new user
const authControllers = {

  createVerification: async (req, res) => {
    const { phoneNumber } = req.body;

    try {
      const existingUser = await VerifyUser.findOne({ phone: phoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const code = generateVerificationCode()

      const user = new VerifyUser({
        phone: phoneNumber,
        code
      })

      await sendSms({ to: phoneNumber, code })

      const savedUser = await user.save();
      res.status(201).json({ message: "User created successfully", user: savedUser });

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { phoneNumber, code } = req.body;

      // Validate request body
      if (!phoneNumber || !code) {
        return res.status(400).json({ success: false, message: "Phone Number and OTP are required." });
      }

      // Fetch both user and OTP verification data
      const user = await User.findOne({ phoneNumber });
      const storedOtp = await VerifyUser.findOne({ phone: phoneNumber });

      // Check if at least one data source is available
      if (!user && !storedOtp) {
        return res.status(404).json({ success: false, message: "No user or verification data found for this phone number." });
      }

      // Check if either source has a matching OTP
      let otpValid = false;
      if (storedOtp && storedOtp.code === code) {
        otpValid = true;
      } else if (user && user.code === code) {
        otpValid = true;
      }

      if (!otpValid) {
        return res.status(400).json({ success: false, message: "Invalid OTP." });
      }

      // OTP is valid
      return res.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ success: false, message: "An error occurred while verifying the OTP." });
    }
  },


  createUser: async (req, res) => {
    const { name, phoneNumber, password } = req.body;
    // console.log(req.body)
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        name,
        phoneNumber,
        password: hashedPassword,
        // role: req.body.role
      });

      const savedUser = await user.save();
      // await VerifyUser.deleteOne({ phone: phoneNumber });

      res.status(201).json({ message: "User created successfully", user: savedUser });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  loginUser: async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, phone: user.phoneNumber },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phoneNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        res.status(400).json({ success: false, message: "Phone number is required." });
        return;
      }

      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      // Generate a random 6-digit OTP
      const otp = generateVerificationCode()

      // Save the OTP to the user's record with an expiration time (e.g., 10 minutes)
      user.code = otp;
      await user.save();

      await sendSms({ to: phoneNumber, otp })
      // Send the OTP via SMS using Termii

      res.status(200).json({
        success: true,
        message: "OTP sent to your phone number.",
      });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { phoneNumber, newPassword } = req.body;

      if (!phoneNumber || !newPassword) {
        res.status(400).json({
          success: false,
          message: "Phone number, and new password are required.",
        });
        return;
      }

      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      // Check if the OTP matches and is not expired
      // if (user.otp !== otp || new Date() > user.otpExpires) {
      //   res.status(400).json({ success: false, message: "Invalid or expired OTP." });
      //   return;
      // }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear the OTP
      user.password = hashedPassword;
      user.code = null;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while resetting your password.",
      });
    }
  },
  resendOtp: async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      // Handle missing phone number
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      const existingVerification = await VerifyUser.findOne({ phone: phoneNumber });
      if (!existingVerification) {
        return res.status(404).json({ message: "Verification not found. Please request a new verification." });
      }
      const code = generateVerificationCode();
      existingVerification.code = code;
      await existingVerification.save();

      await sendSms({ to: phoneNumber, code });

      res.status(200).json({ message: "OTP resent successfully" });

    } catch (error) {
      console.error("Error in resendOtp:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while resendOtp your otp.",
      });
    }
  }
}

module.exports = authControllers