const express = require("express");
const app = express();
const PORT = 5000;

app.get("/message", (req, res) => {
  res.json({ message: "how are you :)" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
