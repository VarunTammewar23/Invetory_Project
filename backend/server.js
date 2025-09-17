const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(express.json());

// Test route
app.get("/message", (req, res) => {
  res.json({ message: "you are stupid :)" });
});

// Route to fetch all from oper_table
app.get("/oper_table", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM oper_table");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Route to fetch all from stock_data
app.get("/stock_data", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM stock_data");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Route to fetch all from user_set
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
  console.log(`Server running at http://0.0.0.0:5000`);
});
