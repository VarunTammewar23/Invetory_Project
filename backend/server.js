const express = require("express");
const cors = require("cors");
const pool = require("./db"); // your MySQL pool
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/message", (req, res) => {
  res.json({ message: "Server is running :) " });
});

// ✅ Route to fetch ALL stock_data
app.get("/stock_data", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM stock_data");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// ✅ Route to fetch ALL user_set
app.get("/user_set", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user_set");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// ✅ Route to fetch items from oper_table by OTP
app.get("/oper_table/:otp_val", async (req, res) => {
  const { otp_val } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM oper_table WHERE otp_val = ?",
      [otp_val]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// ✅ Route to fetch ALL oper_table
app.get("/oper_table", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM oper_table");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// 🔑 Validate OTP
app.post("/validate-otp", async (req, res) => {
  try {
    console.log("👉 Request body:", req.body);

    const { otp_val } = req.body; // use otp_val key

    if (!otp_val) {
      console.log("❌ No OTP received in request.");
      return res.status(400).json({ success: false, message: "No OTP provided" });
    }

    // Query DB
    const [rows] = await pool.query(
      "SELECT * FROM oper_table WHERE otp_val = ?",
      [otp_val]
    );

    console.log("👉 Query result:", rows);

    if (rows.length > 0) {
      console.log("✅ OTP valid:", otp_val);
      res.json({ success: true, otp_val, rows }); // send rows for debugging
    } else {
      console.log("❌ OTP not found in DB:", otp_val);
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("🔥 Database error:", err);
    res.status(500).send("Database error");
  }
});

// 🔑 Update status by sr_no
app.put("/oper_table/:sr_no/status", async (req, res) => {
  const { sr_no } = req.params;
  const { status_val } = req.body;
  try {
    await pool.query(
      "UPDATE oper_table SET status_val = ? WHERE sr_no = ?",
      [status_val, sr_no]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
