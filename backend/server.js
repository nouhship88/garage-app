const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // To parse JSON data

// Connect to MongoDB
mongoose.connect("mongodb://mongo:27017/garage", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const User = require("./models/User");
const Product = require("./models/Product");

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Add new user
app.post("/users", async (req, res) => {
  console.log("Incoming user POST:", req.body); // 👈 add this

  const { name, email } = req.body;
  const user = new User({ name, email });

  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error saving user:", err); // 👈 add this
    res.status(400).json({ message: "Error adding user" });
  }
});

// Delete user by ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch((error) => res.status(400).json("Error: " + error));
});

// Update user by ID
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  User.findByIdAndUpdate(id, { name, email }, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch((error) => res.status(400).json("Error: " + error));
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("userId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Add new product
app.post("/products", async (req, res) => {
  const { name, price, description, userId } = req.body;
  const product = new Product({ name, price, description, userId });

  try {
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Error adding product" });
  }
});

// Delete product by ID
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then(() => res.json({ message: "Product deleted successfully" }))
    .catch((error) => res.status(400).json("Error: " + error));
});

// Update product by ID
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  Product.findByIdAndUpdate(id, { name, price, description }, { new: true })
    .then((updatedProduct) => res.json(updatedProduct))
    .catch((error) => res.status(400).json("Error: " + error));
});

