const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());

console.log("KEY LOADED:", !!process.env.VITE_CLAUDE_API_KEY);

const ANTHROPIC_HEADERS = {
  "x-api-key": process.env.VITE_CLAUDE_API_KEY,
  "anthropic-version": "2023-06-01",
  "content-type": "application/json",
};

// ─────────────────────────────────────────────
// Tool definitions per agent mode
// ─────────────────────────────────────────────

const PATH_SCHEMA = {
  type: "object",
  properties: {
    courses:          { type: "string" },
    testing:          { type: "string" },
    extracurriculars: { type: "string" },
    collegeRange:     { type: "string" },
    summary:          { type: "string" },
    metrics: {
      type: "object",
      properties: {
        effort:           { type: "string" },
        stress:           { type: "string" },
        competitiveness:  { type: "string" },
        flexibility:      { type: "string" },
        cost:             { type: "string" },
      },
      required: ["effort", "stress", "competitiveness", "flexibility", "cost"],
    },
  },
  required: ["courses", "testing", "extracurriculars", "collegeRange", "summary", "metrics"],
};

const AGENT_TOOLS = {
  simulation: [
    {
      name: "assess_profile",
      description:
        "Analyze the student profile before generating paths. Identify the most important academic signals and decide how to differentiate the three paths for this specific student.",
      input_schema: {
        type: "object",
        properties: {
          key_signals: {
            type: "array",
            items: { type: "string" },
            description: "Most important factors from this student's profile",
          },
          differentiation_strategy: {
            type: "string",
            description: "How competitive/balanced/focused will differ meaningfully for this student",
          },
        },
        required: ["key_signals", "differentiation_strategy"],
      },
    },
    {
      name: "finalize_simulation",
      description: "Commit the three finalized academic paths as the simulation output.",
      input_schema: {
        type: "object",
        properties: {
          competitive: PATH_SCHEMA,
          balanced:    PATH_SCHEMA,
          focused:     PATH_SCHEMA,
        },
        required: ["competitive", "balanced", "focused"],
      },
    },
  ],

  final: [
    {
      name: "analyze_context",
      description:
        "Reason through the full conversation and profile. Identify which path fits best and what specific concerns the parent raised.",
      input_schema: {
        type: "object",
        properties: {
          recommended_path: {
            type: "string",
            enum: ["competitive", "balanced", "focused"],
          },
          reasoning: { type: "string" },
          parent_concerns: {
            type: "array",
            items: { type: "string" },
            description: "Key concerns raised in the chat that must be addressed in the plan",
          },
        },
        required: ["recommended_path", "reasoning", "parent_concerns"],
      },
    },
    {
      name: "finalize_plan",
      description: "Commit the final personalized academic plan.",
      input_schema: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "2-3 sentence summary of the student's situation and recommended direction",
          },
          recommendedPath: {
            type: "string",
            enum: ["competitive", "balanced", "focused"],
          },
          actionSteps: {
            type: "array",
            items: { type: "string" },
            description: "3-5 concrete, specific next steps the parent should take",
          },
        },
        required: ["summary", "recommendedPath", "actionSteps"],
      },
    },
  ],

  chat: [
    {
      name: "think",
      description:
        "Internal reasoning step — not shown to the user. Consider the parent's specific concern, what the profile implies about their child's situation, and the most genuinely helpful response approach.",
      input_schema: {
        type: "object",
        properties: {
          parent_concern:           { type: "string" },
          relevant_profile_context: { type: "string" },
          response_approach:        { type: "string" },
        },
        required: ["parent_concern", "relevant_profile_context", "response_approach"],
      },
    },
    {
      name: "respond",
      description: "Send the final response to the parent.",
      input_schema: {
        type: "object",
        properties: {
          message:   { type: "string" },
          followups: { type: "array", items: { type: "string" } },
        },
        required: ["message", "followups"],
      },
    },
  ],
};

// The tool whose input is the final answer for each mode
const STOP_TOOL = {
  simulation: "finalize_simulation",
  final:      "finalize_plan",
  chat:       "respond",
};

// ─────────────────────────────────────────────
// Legacy single-shot endpoint (kept for fallback)
// ─────────────────────────────────────────────

app.post("/api/claude", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-6",
        max_tokens: req.body.max_tokens || 1000,
        messages: req.body.messages,
      },
      { headers: ANTHROPIC_HEADERS }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Claude API error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Server error calling Claude",
      details: err.response?.data || err.message,
    });
  }
});

// ─────────────────────────────────────────────
// Agentic tool-use loop endpoint
// ─────────────────────────────────────────────

app.post("/api/agent", async (req, res) => {
  const { mode, messages, max_tokens } = req.body;

  const tools = AGENT_TOOLS[mode];
  if (!tools) {
    return res.status(400).json({ error: "unknown_mode", mode });
  }

  const stopTool = STOP_TOOL[mode];
  let currentMessages = [...messages];
  const MAX_ITERATIONS = 8;

  try {
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model:      "claude-sonnet-4-6",
          max_tokens: max_tokens || 2000,
          tools,
          messages:   currentMessages,
        },
        { headers: ANTHROPIC_HEADERS }
      );

      const content    = response.data.content;
      const stopReason = response.data.stop_reason;

      // Append assistant turn
      currentMessages = [...currentMessages, { role: "assistant", content }];

      if (stopReason === "tool_use") {
        const toolCalls = content.filter(b => b.type === "tool_use");

        // If the finalizing tool was called, we're done — return its input as the result
        const finalCall = toolCalls.find(t => t.name === stopTool);
        if (finalCall) {
          console.log(`[Agent] mode=${mode} completed in ${i + 1} iteration(s)`);
          return res.json({ result: finalCall.input });
        }

        // Otherwise return each tool result and continue the loop
        const toolResults = toolCalls.map(call => ({
          type:        "tool_result",
          tool_use_id: call.id,
          content:     JSON.stringify(call.input),
        }));

        currentMessages = [
          ...currentMessages,
          { role: "user", content: toolResults },
        ];
      } else {
        // end_turn without any tool call — agent stalled
        break;
      }
    }

    console.error(`[Agent] mode=${mode} stalled after ${MAX_ITERATIONS} iterations`);
    res.status(500).json({ error: "agent_stalled" });
  } catch (err) {
    console.error("[Agent] error:", err.response?.data || err.message);
    res.status(500).json({
      error: "agent_error",
      details: err.response?.data || err.message,
    });
  }
});

app.listen(3001, () =>
  console.log("Server running on http://localhost:3001")
);
