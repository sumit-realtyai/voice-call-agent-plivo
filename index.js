// import WebSocket, { WebSocketServer } from "ws";
// import express from "express";
// import http from "http";
// import dotenv from "dotenv";
// import { Buffer } from "buffer";
// import fs from "fs";
// const audioStream = fs.createWriteStream("plivo_audio.raw");

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const server = http.createServer(app);
// const wss = new WebSocketServer({ noServer: true });
// const PORT = 5000;

// const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const GOOGLE_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GOOGLE_API_KEY}`;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.post("/webhook", (req, res) => {
//   const PlivoXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
//                             <Response>
//                               <Speak>Hi there! You are now connected. How can I help you today?</Speak>
//                               <Stream streamTimeout="86400" keepCallAlive="true" bidirectional="true" contentType="audio/x-mulaw;rate=8000" audioTrack="inbound">
//                                   ws://${req.hostname}/media-stream
//                               </Stream>
//                             </Response>`;
//   res.type("text/xml").send(PlivoXMLResponse);
// });

// server.on("upgrade", (request, socket, head) => {
//   if (request.url === "/media-stream") {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//       wss.emit("connection", ws, request);
//     });
//   } else {
//     socket.destroy();
//   }
// });

// const startGoogleWebSocket = (plivoWS) => {
//   const googleWS = new WebSocket(GOOGLE_WS_URL);

//   let isSetupComplete = false; // Track setup completion

//   googleWS.on("open", () => {
//     console.log("✅ Connected to Google Multimodal Live API");

//     // Send Initial Setup
//     googleWS.send(
//       JSON.stringify({
//         setup: {
//           model: "models/gemini-2.0-flash-exp",
//           generation_config: { response_modalities: ["AUDIO"] },
//         },
//       })
//     );
//   });

//   googleWS.on("message", (message) => {
//     try {
//       const response = JSON.parse(message);
//       console.log("🔹 Full Google API Response:", JSON.stringify(response, null, 2));

//       if (response.setupComplete) {
//         console.log("✅ Google Setup Complete. Ready to send audio.");
//         isSetupComplete = true;
//         return;
//       }

//       if (response.serverContent?.modelTurn?.parts) {
//         const audioData = response.serverContent.modelTurn.parts.find(
//           (part) => part.inlineData?.data
//         );

//         if (audioData) {
//           console.log("🔹 Sending AI-generated audio to Plivo...");

//           const audioDelta = {
//             event: "playAudio",
//             media: {
//               contentType: "audio/x-mulaw",
//               sampleRate: 8000,
//               payload: audioData.inlineData.data,
//             },
//           };

//           plivoWS.send(JSON.stringify(audioDelta));
//         } else {
//           console.log("⚠️ No audio data found in response.");
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error processing Google response:", error);
//     }
//   });

//   googleWS.on("close", (code, reason) => {
//     console.log(`❌ Disconnected from Google API. Code: ${code}, Reason: ${reason.toString()}`);
//   });

//   googleWS.on("error", (error) => {
//     console.error("❌ Error in Google WebSocket:", error);
//   });

//   return { googleWS, isSetupComplete };
// };

// wss.on("connection", (connection) => {
//   console.log("✅ Client connected to WebSocket");
//   let { googleWS, isSetupComplete } = startGoogleWebSocket(connection);

//   connection.on("message", (message) => {

//     try {
//       const data = JSON.parse(message);
  
//       if (data.event === "start") {
//         console.log("✅ Plivo Stream Started. Stream ID:", data.start.stream_id);
//         connection.streamId = data.start.stream_id;
//       }
  
//       if (data.event === "media") {
//         console.log(`🎤 Received audio from Plivo. Stream ID: ${connection.streamId || "unknown"}`);
//         console.log("🔹 Audio Payload Length:", data.media.payload.length);
  
//         // Decode and write to file
//         const decodedAudio = Buffer.from(data.media.payload, "base64");
//         audioStream.write(decodedAudio);
  
//         console.log("🔹 Saved audio to plivo_audio.raw");
//       }
//     } catch (error) {
//       console.error("❌ Error parsing message:", error);
//     }

//     try {
//       const data = JSON.parse(message);
//        if (data.event === "media") {
//       console.log("🎤 Received audio from Plivo. Stream ID:", data.stream_id);
//       console.log("🔹 Audio Payload Length:", data.media.payload.length);

//       // Save first few bytes of audio as base64 (for debugging)
//       console.log("🔹 Audio Sample:", data.media.payload.substring(0, 50)); 
//     }

//       if (data.event === "media" && googleWS.readyState === WebSocket.OPEN) {
//         if (!isSetupComplete) {
//           console.log("⚠️ Google setup not complete, waiting...");
//           return;
//         }

//         console.log("🔹 Forwarding audio from Plivo to Google...");

//         googleWS.send(
//           JSON.stringify({
//             realtime_input: {
//               media_chunks: [
//                 {
//                   mime_type: "audio/pcm;rate=24000",
//                   data: data.media.payload,
//                 },
//               ],
//             },
//           })
//         );
//       }
//     } catch (error) {
//       console.error("❌ Error parsing message:", error);
//     }
//   });

//   connection.on("close", () => {
//     if (googleWS.readyState === WebSocket.OPEN) googleWS.close();
//     console.log("❌ Client disconnected");
//   });
// });

// server.listen(PORT, () => {
//   console.log(`🚀 Server started on port ${PORT}`);
// });






import express from 'express';
// import  createCall from './twilio-makecall.js';
import { connectToDatabase } from './src/config/mongoose-connect.js';
import { assistantRequest, endCallReport } from './src/controllers/voiceCall.controller.js';
import twilio from 'twilio';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {  
     console.log('hello world')
     res.send('Hello World!')
     });

// app.post('/transfer', async (req, res) => {
//      console.log('req body', req.body?.message?.call?.id);
//      await createCall();
//   res.send('transfer request received');   
// })

app.post('/msg-receive', async (req, res) => {

     console.log('message received', req.body);
     
  res.send('message received');   
})

// Prepare the assistant response

 

 

 {
  /**
   * **database schema**
   * // store all the structured data in the database
   * // store the call recording in the database
   * // store the call summary in the database
   * // store the customer number
   * // store the forwarded from number
   * // store the call transcript
   * // store the user extracted info like name, email, etc.
  
  
  * **crete the UI to display the call summary,
  * // call recording, call transcript, user extracted info, etc.**

  */
}
app.post("/vapi-inbound", async (req, res) => {
     try {
       console.log('vapi-inbound', req.body.message.type);

     if(req.body.message.type=="end-of-call-report") {
        endCallReport(req,res);
     }
     else if(req.body.message.type== "assistant-request") {
      assistantRequest(req,res);
  
  }
      else {
            // unwanted type atleast for now
          }
    
     } catch (error) {
          console.log('error', error);
     }
})

app.get("/forward", (req, res) => {
  console.log('forward request received*************');
    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Dial callerId="+917015670076">+917415942766</Dial>
        </Response>`;
    res.type("text/xml");
    res.send(xmlResponse);
});

app.post('/existing', async (req, res) => {
  console.log('existing user');
  res.send('existing user');
});



// Update Phone Number (PATCH /phone-number/:id)
// const response = await fetch("https://api.vapi.ai/phone-number/b882572f-eff7-4647-9ba1-60610e80bcf3", {
//      method: "PATCH",
//      headers: {
//        "Authorization": "Bearer 48af3017-c41d-4ec5-88de-e53491cdf69a",
//        "Content-Type": "application/json"
//      },
//      body: JSON.stringify({
//        "provider": "twilio",
//        "server": {
//          "url": "https://9048-2405-201-300c-22a-cfb-7584-cd81-541f.ngrok-free.app/vapi-inbound"
//        }
//      }),
//    });
   
//    const body = await response.json();
//    console.log(body);












(async () => {
  await connectToDatabase(); // Ensures DB is connected before starting the server
  app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
  });
})();
