const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const ffmpeg = require("fluent-ffmpeg");
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

const PORT = 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/webhook", (req, res) => {
  const PlivoXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Speak>Hi there! Start speaking, and I will transcribe.</Speak>
      <Stream streamTimeout="86400" keepCallAlive="true" bidirectional="true" contentType="audio/x-mulaw;rate=8000" audioTrack="inbound">
        ws://${req.hostname}/media-stream
      </Stream>
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

wss.on("connection", (ws) => {
  console.log("WebSocket connected with Plivo.");
  const audioFile = "audio.mulaw";
  const wavFile = "audio.wav";

  let audioChunks = []; // Buffer audio chunks for better transcription

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.event !== "media") return;

      // Decode Base64 audio payload correctly
      const audioBuffer = Buffer.from(data.media.payload, "base64");
      audioChunks.push(audioBuffer); // Store chunks

      console.log("Received audio chunk.");
    } catch (error) {
      console.error("Error processing audio chunk:", error.message);
    }
  });

  ws.on("close", async () => {
    console.log("WebSocket closed. Converting and transcribing...");

    // Save the buffered audio to file
    fs.writeFileSync(audioFile, Buffer.concat(audioChunks));

    // Convert .mulaw to .wav with correct sample rate & format
    await new Promise((resolve, reject) => {
      ffmpeg(audioFile)
        .inputFormat("mulaw")
        .inputOptions(["-ar 8000", "-ac 1"]) // Ensure 8kHz sample rate & mono
        .audioCodec("pcm_s16le")  // Convert to PCM 16-bit little-endian
        .audioChannels(1)         // Mono audio (important for telephony)
        .audioFrequency(16000)    // Upsample to 16kHz for Whisper
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(wavFile);
    });

    console.log("Conversion to WAV completed.");

    // Send to Whisper API with correct settings
    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(wavFile));
      formData.append("model", "whisper-1");
      formData.append("language", "en"); // Specify language for better accuracy
      formData.append("temperature", 0); // Reduce randomness

      const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, ...formData.getHeaders() },
      });

      const transcription = response.data.text;
      console.log("Transcription:", transcription);

      // Save transcription
      fs.appendFileSync("transcriptions.txt", transcription + "\n");

      // send trnasctiption to gpt 4o to get the answer
      // Inside ws.on("close", async () => { ... })

try {
  const openaiResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: [{ role: "user", content: transcription }],
      temperature: 0.7,
    },
    { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
  );

  const aiResponseText = openaiResponse.data.choices[0].message.content;
  console.log("AI Response:", aiResponseText);

  // Save AI response for debugging
  fs.appendFileSync("ai_responses.txt", aiResponseText + "\n");

    // Convert AI response to speech
        const ttsResponse = await axios.post(
          "https://api.openai.com/v1/audio/speech",
          {
            model: "tts-1",
            input: aiResponseText,
            voice: "alloy"
          },
          { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" }, responseType: "arraybuffer" }
        );

   // Create a dynamic filename
   const fileName = `outputVoice_${Date.now()}.wav`;  // Adding timestamp to make the filename unique
   const filePath = path.join(__dirname, fileName);  // Store file in the current directory

   // Write the audio buffer to a file
   fs.writeFile(filePath, Buffer.from(ttsResponse.data), (err) => {
     if (err) {
       console.error('Error writing file:', err);
     } else {
       console.log(`Audio saved to ${filePath}`);
     }
   });

} catch (error) {
  console.error("AI Response error:", error.response?.data || error.message);
}

    } catch (error) {
      console.error("Transcription error:", error.response?.data || error.message);
    }
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


 // if (audioChunks.length > 0) {
    //   fs.writeFileSync(audioFile, Buffer.concat(audioChunks));
  
    //   // Convert remaining audio to WAV
    //   await new Promise((resolve, reject) => {
    //     ffmpeg(audioFile)
    //       .inputFormat("mulaw")
    //       .audioCodec("pcm_s16le")
    //       .audioChannels(1)
    //       .audioFrequency(16000)
    //       .toFormat("wav")
    //       .on("end", resolve)
    //       .on("error", reject)
    //       .save(wavFile);
    //   });
  
    //   console.log("Final audio processed. Transcribing...");
  
    //   // Transcribe remaining audio
    //   const formData = new FormData();
    //   formData.append("file", fs.createReadStream(wavFile));
    //   formData.append("model", "whisper-1");
  
    //   const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
    //     headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, ...formData.getHeaders() },
    //   });
  
    //   const transcription = response.data.text;
    //   console.log("Final Transcription:", transcription);
  
    //   // Save transcription
    //   fs.appendFileSync("transcriptions.txt", transcription + "\n");
    // }