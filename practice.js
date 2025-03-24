import WebSocket from "ws";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = "models/gemini-2.0-flash-exp";
const GOOGLE_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;

const ws = new WebSocket(GOOGLE_WS_URL);

ws.on("open", () => {
  console.log("✅ Connected to Gemini 2.0 Live API");

  // Send initial setup request
  ws.send(
    JSON.stringify({
      setup: {
        model: MODEL_ID,
        generation_config: {
          response_modalities: ["TEXT"],
        },
      },
    })
  );

  // Start user input
  startUserInput();
});

ws.on("message", (message) => {
  try {
    const response = JSON.parse(message);
    console.log("🔹 Raw API Response:", JSON.stringify(response, null, 2));

    if (response.setupComplete) {
      console.log("✅ Setup Complete! You can now start chatting.");
    } else if (response.serverContent?.modelTurn?.parts) {
      const textResponse =
        response.serverContent.modelTurn.parts
          .map((part) => part.text || "")
          .join("\n");
      console.log(`🤖 Gemini: ${textResponse}`);
    }
  } catch (error) {
    console.error("❌ Error processing response:", error);
  }
});

ws.on("close", (code, reason) => {
  console.log(`❌ Disconnected from Gemini API. Code: ${code}, Reason: ${reason.toString()}`);
});

ws.on("error", (error) => {
  console.error("❌ WebSocket Error:", error);
});

function startUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (message) => {
    if (message.toLowerCase() === "exit") {
      console.log("👋 Exiting...");
      ws.close();
      rl.close();
      return;
    }

    // Send user message to Gemini
    ws.send(
      JSON.stringify({
        clientContent: {
          turns: [
            {
              role: "USER",
              parts: [{ text: message }],
            },
          ],
          turnComplete: true,
        },
      })
    );
  });

  rl.on("close", () => {
    console.log("🔴 User input closed.");
    process.exit(0);
  });
}
