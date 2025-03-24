import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GOOGLE_API_KEY}`;

// ✅ Create a raw HTTP server for WebSocket upgrade handling
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running...");
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
});

// ✅ WebSocket connection handling
wss.on("connection", (clientWS) => {
  console.log("✅ Frontend Connected via WebSocket");

  const googleWS = new WebSocket(GOOGLE_WS_URL);

  googleWS.on("open", () => {
    console.log("✅ Connected to Google Multimodal Live API");

    googleWS.send(
      JSON.stringify({
        setup: {
          model: "models/gemini-2.0-flash-exp",
          generationConfig: {
            responseModalities: ["AUDIO"],
            candidateCount: 1,
            maxOutputTokens: 500,
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Aoede",
                },
              },
            },
          },
        },
      })
    );
  });

  let isSetupComplete = false; // ✅ Ensure correct flag usage

  googleWS.on("message", (message) => {
    try {
      const response = JSON.parse(message);
      console.log("🔹 Raw Google API Response:", JSON.stringify(response, null, 2));
  
      if (response.setupComplete) {
        console.log("✅ Google Setup Complete. Ready to send audio.");
        isSetupComplete = true; // ✅ Set flag after setup is confirmed
      }
  
      if (response.serverContent?.modelTurn?.parts) {
        const audioParts = response.serverContent.modelTurn.parts
          .filter((part) => part.inlineData?.data) // ✅ Collect all audio parts
          .map((part) => Buffer.from(part.inlineData.data, "base64"));
  
        if (audioParts.length > 0) {
          console.log(`🔹 AI-Generated Audio Received. Sending ${audioParts.length} parts to Frontend...`);
          audioParts.forEach((audioChunk) => clientWS.send(audioChunk)); // ✅ Send all audio chunks
        } else {
          console.log("⚠️ No AI-Generated Audio Found in Response.");
        }
      }
    } catch (error) {
      console.error("❌ Error processing Google response:", error);
    }
  });
  




  googleWS.on("error", (error) => console.error("❌ Google WebSocket Error:", error));
  googleWS.on("close", (code, reason) => console.log(`❌ Disconnected from Google API. Code: ${code}, Reason: ${reason.toString()}`));

  // ✅ Only send audio after `isSetupComplete` is true
clientWS.on("message", (message) => {
  if (!isSetupComplete) {
    console.log("⚠️ Cannot send audio yet. Waiting for Google setup...");
    return;
  }

  console.log("🎤 Forwarding audio to Google...");
  googleWS.send(
    JSON.stringify({
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: "audio/pcm;rate=16000",
            data: message.toString("base64"),
          },
        ],
      },
    })
  );
});
  

  clientWS.on("close", () => {
    console.log("❌ Frontend Disconnected");
    googleWS.close();
  });
});
