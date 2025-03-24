import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Buffer } from "buffer";
import fs from "fs";
const audioStream = fs.createWriteStream("plivo_audio.raw");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const PORT = 5000;

// const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const GOOGLE_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GOOGLE_API_KEY}`;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/webhook", (req, res) => {
    
  const PlivoXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
                            <Response>
                              <Speak>Hi there! You are now connected. How can I help you today Sumit Sumit?</Speak>
                            
                            </Response>`;
  res.type("text/xml").send(PlivoXMLResponse);
});

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/media-stream") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});



server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
