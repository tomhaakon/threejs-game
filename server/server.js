const express = require("express");

const app = express();
app.use(express.json());

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const port = 3000;

app.post("/api/add-text", (req, res) => {
  const { text } = req.body;
  // Insert the text into the database
  // Send a response
  res.json({ success: true, message: "Text added successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
