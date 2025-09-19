const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Connect DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // your MySQL user
  password: "Bankar@2004",// your MySQL password
  database: "wms_varun"
});

// ✅ API: Get items by rack
app.get("/rack/:id", (req, res) => {
  const rackId = req.params.id;
  db.query(
    "SELECT * FROM stock_data WHERE rack_no = ?",
    [rackId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
