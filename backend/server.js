// const express = require("express");
// const app = express();
// const PORT = 5000;

// app.get("/message", (req, res) => {
//   res.json({ message: "how are you :)" });
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running at http://0.0.0.0:${PORT}`);
// });


const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // your MySQL user
  password: "Bankar@2004", // your MySQL password
  database: "wms_varun"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected!");
  }
});

// Route: get parts by rack_no
app.get("/items/:rackId", (req, res) => {
  const rackId = req.params.rackId;
  const query = "SELECT part_name, part_code, part_desp, qty_val FROM stock_data WHERE rack_no = ?";
  
  db.query(query, [rackId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ rackId, items: results });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM user_set WHERE USER_NAME = ? AND PSWD = ?";
  
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user: results[0] });
  });
});

db.on("error", (err) => {
  console.error("DB error", err);
});
