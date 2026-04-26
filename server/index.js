const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 Debug (remove later if you want)
console.log("KEY LOADED:", !!process.env.VITE_CLAUDE_API_KEY);

app.post("/api/claude", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
  model: "claude-sonnet-4-6",
  max_tokens: req.body.max_tokens || 1000,
  messages: req.body.messages,
  },
      {
        headers: {
          "x-api-key": process.env.VITE_CLAUDE_API_KEY, // ✅ FIXED HERE
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "Claude API error:",
      err.response?.data || err.message
    );

    res.status(500).json({
      error: "Server error calling Claude",
      details: err.response?.data || err.message,
    });
  }
});

app.listen(3001, () =>
  console.log("Server running on http://localhost:3001")
);