require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Checkin = require("./models/checkin");
const auth = require("./middleware/auth");
const aiService = require("./services/aiService");

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
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = new User({ username, email, password });
    await user.save();
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
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

// Check-in route (POST)
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
      notes,
      weight
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
      notes,
      weight
    });
    await checkin.save();
    console.log("New enhanced check-in saved to MongoDB:", checkin);
    res.status(201).json({ message: "Check-in saved successfully" });
  } catch (error) {
    console.error("Error saving check-in:", error);
    res.status(500).json({ error: "Failed to save check-in" });
  }
});

// Get all check-ins route (GET)
app.get("/api/checkins", auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ user: req.user._id }).sort({ timestamp: -1 });
    res.json(checkins);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    res.status(500).json({ error: "Failed to fetch check-ins" });
  }
});

// AI Analysis route
app.get("/api/ai/analysis", auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ user: req.user._id }).sort({ timestamp: -1 });
    if (checkins.length === 0) {
      return res.json({ 
        analysis: "Welcome to FitCoach AI! Complete your first check-in to get personalized insights and recommendations." 
      });
    }
    const analysis = await aiService.analyzeCheckins(checkins);
    res.json({ analysis });
  } catch (error) {
    console.error("AI Analysis error:", error);
    res.status(500).json({ error: "Failed to generate AI analysis" });
  }
});

// AI Workout Recommendation route
app.post("/api/ai/workout", auth, async (req, res) => {
  try {
    const { checkin } = req.body;
    const recommendation = await aiService.generateWorkoutRecommendation(checkin);
    res.json({ recommendation });
  } catch (error) {
    console.error("AI Workout Recommendation error:", error);
    res.status(500).json({ error: "Failed to generate workout recommendation" });
  }
});

// AI Health Question route
app.post("/api/ai/question", auth, async (req, res) => {
  try {
    const { question } = req.body;
    const checkins = await Checkin.find({ user: req.user._id }).sort({ timestamp: -1 });
    const answer = await aiService.answerHealthQuestion(question, checkins);
    res.json({ answer });
  } catch (error) {
    console.error("AI Health Question error:", error);
    res.status(500).json({ error: "Failed to answer health question" });
  }
});

// Get weight goal
app.get("/api/weight-goal", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ weightGoal: user.weightGoal });
  } catch (error) {
    res.status(500).json({ error: "Failed to get weight goal" });
  }
});

// Update weight goal
app.put("/api/weight-goal", auth, async (req, res) => {
  try {
    const { weightGoal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { weightGoal },
      { new: true }
    );
    res.json({ weightGoal: user.weightGoal });
  } catch (error) {
    res.status(500).json({ error: "Failed to update weight goal" });
  }
});

// --- FRIENDS FEATURE ENDPOINTS ---

// Search users by username or email (for adding friends)
app.get('/api/users/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) {
      return res.json([]);
    }
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('_id username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Add a friend (by userId)
app.post('/api/friends/add', auth, async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId || friendId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Invalid friend ID' });
    }
    // Check if already friends
    if (req.user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Already friends' });
    }
    // Add friend to user's friends list
    req.user.friends.push(friendId);
    await req.user.save();
    // Optionally, add user to friend's friends list (bidirectional)
    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: req.user._id } });
    res.json({ message: 'Friend added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

// List current user's friends
app.get('/api/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', '_id username email');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get friends' });
  }
});

// Get recent check-ins from friends
app.get('/api/friends/checkins', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.friends || user.friends.length === 0) {
      return res.json([]);
    }
    // Get recent check-ins for all friends (last 10 per friend)
    const checkins = await Checkin.find({ user: { $in: user.friends } })
      .sort({ timestamp: -1 })
      .limit(30)
      .populate('user', 'username email');
    res.json(checkins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get friends check-ins' });
  }
});

// Port
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
