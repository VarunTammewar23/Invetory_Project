// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",          // your MySQL username
  password: "Bankar@2004", // your MySQL password
  database: "wms_varun"
});

module.exports = pool;
