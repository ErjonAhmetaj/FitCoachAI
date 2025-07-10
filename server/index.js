const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Checkin = require("./models/checkin");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("FitCoach AI backend is running!");
});

// Register route
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Protected route to get user profile
app.get("/api/profile", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Check-in route (now protected)
app.post("/api/checkin", auth, async (req, res) => {
  try {
    const { 
      mood, 
      energy, 
      soreness, 
      sleepHours, 
      sleepQuality, 
      stressLevel, 
      recovery, 
      hydration, 
      nutritionQuality, 
      workoutMotivation, 
      fitnessGoal, 
      notes 
    } = req.body;
    
    const checkin = new Checkin({ 
      user: req.user._id,
      mood, 
      energy, 
      soreness,
      sleepHours,
      sleepQuality,
      stressLevel,
      recovery,
      hydration,
      nutritionQuality,
      workoutMotivation,
      fitnessGoal,
      notes
    });
    await checkin.save();
    console.log("New enhanced check-in saved to MongoDB:", checkin);
    res.status(201).json({ message: "Check-in saved successfully" });
  } catch (error) {
    console.error("Error saving check-in:", error);
    res.status(500).json({ error: "Failed to save check-in" });
  }
});

// Get all check-ins route (now protected and user-specific)
app.get("/api/checkins", auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ user: req.user._id }).sort({ timestamp: -1 });
    res.json(checkins);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    res.status(500).json({ error: "Failed to fetch check-ins" });
  }
});

// Port
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
