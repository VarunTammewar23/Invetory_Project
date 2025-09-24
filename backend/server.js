const express = require("express");
const cors = require("cors");
const pool = require("./db");
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
app.get("/oper_table/:otp", async (req, res) => {
  const { otp } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM oper_table WHERE otp = ?",
      [otp]
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

// 🔑 NEW: Validate OTP
// 🔑 NEW: Validate OTP (with debugging)
app.post("/validate-otp", async (req, res) => {
  try {
    console.log("👉 Request body:", req.body); // log incoming data

    const { otp } = req.body;

    if (!otp) {
      console.log("❌ No OTP received in request.");
      return res.status(400).json({ success: false, message: "No OTP provided" });
    }

    // Query DB
    const [rows] = await pool.query("SELECT * FROM oper_table WHERE otp = ?", [otp]);

    console.log("👉 Query result:", rows); // log DB result

    if (rows.length > 0) {
      console.log("✅ OTP valid:", otp);
      res.json({ success: true, otp, rows }); // send rows back too for debugging
    } else {
      console.log("❌ OTP not found in DB:", otp);
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("🔥 Database error:", err);
    res.status(500).send("Database error");
  }
});


// 🔑 NEW: Update status by sr_no
app.put("/oper_table/:sr_no/status", async (req, res) => {
  const { sr_no } = req.params;
  const { status_val } = req.body;
  try {
    await pool.query("UPDATE oper_table SET status_val = ? WHERE sr_no = ?", [status_val, sr_no]);
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
