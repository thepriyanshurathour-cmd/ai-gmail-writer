// server.ts
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var isProduction = process.env.NODE_ENV === "production";
var PORT = Number(process.env.PORT) || 3e3;
var app = express();
app.use(express.json());
var getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
async function generateWithFallback(ai, prompt, schema) {
  const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  let lastError = null;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema
          }
        });
        if (response.text) {
          return response;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt + 1} failed: ${err?.message || err}`);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    }
  }
  throw lastError;
}
app.post("/api/generate-email", async (req, res) => {
  try {
    const {
      description,
      tone = "Professional & Polished",
      recipient = "",
      senderName = "",
      intent = "General Business",
      length = "standard",
      callToAction = "",
      language = "English"
    } = req.body;
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ error: "Description is required to draft an email." });
    }
    const ai = getAiClient();
    const lengthGuide = length === "concise" ? "Concise and to the point (under 80-100 words, no fluff)." : length === "detailed" ? "Comprehensive and thorough (around 150-250 words, detailing background and next steps)." : "Balanced standard length (around 100-160 words, clear paragraphs).";
    const prompt = `You are an elite executive communications expert and professional copywriter.
Turn the following rough description and context into polished, natural, high-impact professional email drafts.

USER'S RAW DESCRIPTION / NOTES:
"""
${description.trim()}
"""

DESIRED PARAMETERS:
- Tone: ${tone}
- Goal / Intent: ${intent}
- Intended Recipient Context: ${recipient ? recipient : "Professional colleague / stakeholder"}
- Sender Name: ${senderName ? senderName : "Not specified (use standard placeholder or signature format)"}
- Key Call to Action (CTA): ${callToAction ? callToAction : "Appropriate next step based on description"}
- Target Length: ${lengthGuide}
- Target Language: ${language}

REQUIREMENTS:
1. Provide 3 distinctly crafted Subject Lines with badges (e.g. "Clear & Direct", "Action Required", "Collaborative").
2. Craft the Primary Email draft adhering strictly to the desired tone, clear formatting, spacing, and a strong professional opening/closing.
3. Craft an Alternative Variant offering another subtle angle (e.g., slightly more direct or slightly warmer) so the user has choices.
4. Provide tone analysis, estimated reading time, and 2-3 quick follow-up action suggestions.
5. Sound human, authentic, and impeccably professional. Avoid robotic or cliched corporate jargon unless specifically prompted.`;
    const schema = {
      type: Type.OBJECT,
      properties: {
        subjectLines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "Subject line text" },
              badge: { type: Type.STRING, description: "Short badge e.g. Direct, Friendly, Urgent, Executive" }
            },
            required: ["text", "badge"]
          },
          description: "3 high-converting subject line suggestions"
        },
        selectedSubject: {
          type: Type.STRING,
          description: "The top recommended subject line"
        },
        primaryEmail: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING, description: "e.g. Hi Alex," },
            body: { type: Type.STRING, description: "Body paragraphs separated by double newlines" },
            closing: { type: Type.STRING, description: "e.g. Best regards," },
            signOff: { type: Type.STRING, description: "Sender name or title" },
            fullText: { type: Type.STRING, description: "Complete full email ready to send" }
          },
          required: ["greeting", "body", "closing", "signOff", "fullText"]
        },
        alternativeVariant: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Variant style description e.g. "More Direct & Concise"' },
            description: { type: Type.STRING, description: "Why use this alternative" },
            fullText: { type: Type.STRING, description: "Complete variant email text" }
          },
          required: ["title", "description", "fullText"]
        },
        toneAnalysis: {
          type: Type.OBJECT,
          properties: {
            primaryTone: { type: Type.STRING, description: "Detected dominant tone" },
            politenessRating: { type: Type.STRING, description: "Politeness and diplomacy level" },
            estimatedReadTimeSeconds: { type: Type.INTEGER, description: "Estimated read time in seconds" },
            keyTakeaway: { type: Type.STRING, description: "One-sentence summary of core message" }
          },
          required: ["primaryTone", "politenessRating", "estimatedReadTimeSeconds", "keyTakeaway"]
        },
        suggestedFollowUps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 to 3 checklist items or next actions for the sender"
        }
      },
      required: ["subjectLines", "selectedSubject", "primaryEmail", "alternativeVariant", "toneAnalysis", "suggestedFollowUps"]
    };
    const response = await generateWithFallback(ai, prompt, schema);
    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    console.error("Error generating email:", error);
    return res.status(500).json({
      error: error?.message || "An error occurred while generating the email."
    });
  }
});
app.post("/api/refine-email", async (req, res) => {
  try {
    const { currentEmail, currentSubject, refinementType, customInstruction } = req.body;
    if (!currentEmail || typeof currentEmail !== "string") {
      return res.status(400).json({ error: "currentEmail text is required for refinement." });
    }
    const ai = getAiClient();
    const prompt = `You are an expert executive email editor.
Refine the following email according to the specified instruction.

CURRENT SUBJECT: ${currentSubject || "(none)"}
CURRENT EMAIL:
"""
${currentEmail}
"""

REFINEMENT REQUEST:
Type: ${refinementType || "General Polish"}
Instruction: ${customInstruction || "Polish clarity, flow, tone, and grammar while retaining key information."}

Provide an improved subject line, the revised email, and a 1-sentence summary of changes made.`;
    const schema = {
      type: Type.OBJECT,
      properties: {
        refinedSubject: { type: Type.STRING, description: "Updated or refined subject line" },
        refinedEmail: { type: Type.STRING, description: "Complete revised email text" },
        summaryOfChanges: { type: Type.STRING, description: "Short summary of what was adjusted" }
      },
      required: ["refinedSubject", "refinedEmail", "summaryOfChanges"]
    };
    const response = await generateWithFallback(ai, prompt, schema);
    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    console.error("Error refining email:", error);
    return res.status(500).json({
      error: error?.message || "An error occurred while refining the email."
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
