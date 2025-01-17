const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const VerifyUser = require("../models/VerifyUser");
const { generateVerificationCode } = require("../utils/generateVerificationCode");
const { sendSms } = require("../utils/sendOtp");

// Create a new user
const authControllers = {

  createVerification: async (req, res) => {
    const { phone } = req.body;

    try {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const code = generateVerificationCode()

      const user = new VerifyUser({
        phone,
        code
      })
      
      await sendSms({ phone, code })

      const savedUser = await user.save();
      res.status(201).json({ message: "User created successfully", user: savedUser });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { phone, code } = req.body;

      // Validate request body
      if (!phone || !code) {
        res.status(400).json({ success: false, message: "Phone Number and OTP are required." });
        return;
      }

      // Check if the OTP exists for the given email
      const storedOtp = VerifyUser.findOne({ phone });
      if (!storedOtp) {
        res.status(404).json({ success: false, message: "OTP not found for the given phone number." });
        return;
      }

      // Check if the OTP matches
      if (storedOtp.code !== code) {
        res.status(400).json({ success: false, message: "Invalid OTP." });
        return;
      }

      // Check if the OTP is expired
      // if (new Date() > storedOtp.expiry) {
      //   res.status(400).json({ success: false, message: "OTP has expired." });
      //   return;
      // }

      // OTP is valid
      res.status(200).json({ success: true, message: "OTP verified successfully." });

      // Optionally, remove the OTP after verification
      otpStore.delete(email);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ success: false, message: "An error occurred while verifying the OTP." });
    }
  },

  createUser: async (req, res) => {
    const { name, phone, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        name,
        phone,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      res.status(201).json({ message: "User created successfully", user: savedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  loginUser: async (req, res) => {
    const { phone, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ phone });
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
        { id: user._id, phone: user.phpne },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = authControllers