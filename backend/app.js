const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.js");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Define Todo schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log("User registered successfully");
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        config.JWT_SECRET
      );
      res.json({ token });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//create a new task
app.post("/todos", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { title, desc } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo = new Todo({ title, desc, user: req.user.id });
  await newTodo.save();

  res.status(201).json(newTodo);
});

//update a  task
app.put("/todos", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      { _id: req.query.id, user: req.user.id },
      { title, desc },
      { new: true, runValidators: true }
    );
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//delete new task
app.delete("/todos", authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete({
      _id: req.query.id,
      user: req.user.id,
    });
    if (todo) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all tasks
app.get("/todos", authenticateToken, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
});

app.listen(port, () => {
  console.log("listening on port", port);
});
