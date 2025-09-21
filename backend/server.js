const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/message", (req, res) => {
  res.json({ message: "Server is running :)" });
});

// Route to fetch stock items by rack number
app.get("/stock_data/:rack_no", async (req, res) => {
  const { rack_no } = req.params; // get rack number from URL
  try {
    const [rows] = await pool.query(
      "SELECT * FROM stock_data WHERE rack_no = ?",
      [rack_no]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Optional: route to fetch all stock_data
app.get("/stock_data", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM stock_data");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Optional: route for user_set if you need
app.get("/user_set", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user_set");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
