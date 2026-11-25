const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Homepage
app.get("/", (req, res) => {
  res.send("Contact Manager API is running!");
});

// Connect contact routes
const contactRoutes = require("./routes/contacts");
app.use("/api/contacts", contactRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error("MongoDB connection error:", error.message)
  );

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
