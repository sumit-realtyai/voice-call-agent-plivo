// import dotenv from 'dotenv';
// import express from 'express';
// import http from 'http';
// import WebSocket, { WebSocketServer } from 'ws';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini API SDK

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const server = http.createServer(app);
// const wss = new WebSocketServer({ noServer: true });
// const PORT = 5000;
// const { GEMINI_API_KEY } = process.env;

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);








const WebSocket = require('ws');
const { WebSocketServer } = require('ws');
const { aiplatform } = require('@google-cloud/aiplatform');

const dotenv = require('dotenv');
const express = require('express');

dotenv.config();


// --- Authentication ---
const projectId = 'plivo-gemini-integration'; // **REPLACE WITH YOUR PROJECT ID**
const location = 'us-central1'; // Or your preferred location
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS; // **REPLACE WITH YOUR KEY FILE PATH**

// Initialize Vertex AI client
const vertexAI = new aiplatform.VertexAI({ project: projectId, location,credentials: require(keyFilename) });


async function getBearerToken() {
  const credentials = await vertexAI.auth.getAccessToken();
  return credentials.token;
}

// --- Express and WebSocket Server ---
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });



// --- Plivo Webhook ---
app.post("/webhook", (req, res) => {
  const PlivoXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Speak>Hi there! You are now connected. How can I help you today?</Speak>
      <Stream streamTimeout="86400" keepCallAlive="true" bidirectional="true" contentType="audio/x-mulaw;rate=8000" audioTrack="inbound" >
        ws://${req.hostname}/media-stream
      </Stream>
    </Response>`;
  res.type('text/xml').send(PlivoXMLResponse);
});

// --- WebSocket Upgrade ---
server.on('upgrade', (request, socket, head) => {
  if (request.url === '/media-stream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// --- Gemini and Plivo WebSocket Handling ---
const HOST = "us-central1-aiplatform.googleapis.com";
const SERVICE_URL = `wss://${HOST}/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent`;

wss.on('connection', async (plivoWs) => {
  console.log('Plivo Client connected to WebSocket');

  try {
    const bearerToken = await getBearerToken();

    const geminiWs = new WebSocket(SERVICE_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
    });

    geminiWs.onopen = () => {
      console.log("Connected to Gemini");
    };

    geminiWs.onmessage = (event) => {
      try {
        const geminiResponse = JSON.parse(event.data);

        // --- Process Gemini Response (Using Python example) ---
        if (geminiResponse.candidates && geminiResponse.candidates[0] && geminiResponse.candidates[0].content) {
          const geminiAudio = geminiResponse.candidates[0].content;
          plivoWs.send(Buffer.from(geminiAudio, 'base64')); // Send back to Plivo
        } else {
          console.error("Unexpected Gemini Response:", JSON.stringify(geminiResponse, null, 2));
          plivoWs.send(generateSilence());
        }

      } catch (geminiError) {
        console.error("Error processing Gemini response:", geminiError);
        plivoWs.send(generateSilence());
      }
    };

    geminiWs.onerror = (error) => {
      console.error("Gemini WebSocket Error:", error);
      plivoWs.send(generateSilence());
      geminiWs.close();
    };

    geminiWs.onclose = () => {
      console.log("Gemini WebSocket closed");
      plivoWs.close();
    };

    plivoWs.on('message', (message) => { // Audio from Plivo
      try {
        const geminiRequest = {
          instances: [{
            audio: {
              content: message.toString('base64'), // Send directly (no conversion)
            },
          }],
          parameters: {}, // Add parameters as needed
        };

        geminiWs.send(JSON.stringify(geminiRequest));
      } catch (plivoError) {
        console.error("Error processing Plivo audio:", plivoError);
        geminiWs.close();
        plivoWs.send(generateSilence());
      }
    });

    plivoWs.on('close', () => {
      console.log('Plivo Client disconnected');
      geminiWs.close();
    });

    plivoWs.on('error', (error) => {
        console.error("Plivo WebSocket Error:", error);
        geminiWs.close();
    })


  } catch (error) {
    console.error("Error handling Plivo WebSocket connection:", error);
    plivoWs.send(generateSilence());
    plivoWs.close();
  }
});

server.listen(port, () => { 
  console.log(`Server started on port ${port}`);
});


// --- Generate Silence ---
function generateSilence() {
  // Generate silence in the COMPATIBLE format (mu-law or linear PCM)
  return Buffer.from([0]); // Example: very short silence - adjust as needed
}

// --- WebSocket Client (Example - adapt as needed) ---
// (This would be in a separate file or browser code)
/*
const ws = new WebSocket('ws://your-server-address');

ws.onopen = async () => {
  const token = await getBearerToken();
  ws.send(JSON.stringify({ bearer_token: token }));
  // ... (Code to get microphone audio and send to server)
};

ws.onmessage = event => {
  // ... (Handle messages from the server)
};
*/