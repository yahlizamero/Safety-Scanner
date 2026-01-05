import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if the user already exists in the DB
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create a new user instance (saving the password as plain text)
    const newUser = new User({
      fullName,
      email,
      password, // No hashing, just the raw string
    });

    // 3. Save to database
    await newUser.save();

    // 4. Send success response
    res.status(201).json({ 
      message: "User registered successfully",
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error during registration", 
      error: error.message 
    });
  }
};

// Function for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. If user doesn't exist or password doesn't match
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Success - send user data back (without sensitive info if possible)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};