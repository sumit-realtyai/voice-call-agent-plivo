const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
let storedStreamId;
const PORT = 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var count = 0;

app.post("/webhook", (req, res) => {
  const PlivoXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Speak>Hi there! Start speaking, and I will respond.</Speak>
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
  let audioBufferStore = []; // Buffer to store audio chunks
  const wavFile = "audio.wav";

  ws.on("message", async (message) => {
    console.log('count is ', count);
  try {
    if(count ===0 ) {
      count++ ; 
      const data = JSON.parse(message);

      if (data.event === "start") {
        storedStreamId = data.start?.streamId || null;
        console.log("Call started. Stored stream_id:", storedStreamId);
        return;
      }
  
      // *********** testingcode started
      try {
        if (!storedStreamId) {
          console.error("Cannot send audio to Plivo: Missing stream_id.");
          return;
        }
  
        // Convert output.wav to mulaw format
        console.log("Converting output.wav to mulaw format...");
        await new Promise((resolve, reject) => {
          ffmpeg("output.wav")
            .audioCodec("pcm_mulaw")
            .audioChannels(1)
            .audioFrequency(8000)
            .format("mulaw")
            .on("end", resolve)
            .on("error", reject)
            .save("output.mulaw");
        });
  
        console.log("Conversion completed. Sending fallback audio to Plivo...");
        const fallbackAudio = fs.readFileSync("output.mulaw");
        
        console.log("Sending fallback audio to Plivo...");
        
        const audioMessage = {
          event: "media",
          stream_id: storedStreamId,
          media: { payload: fallbackAudio.toString("base64") }
        };
        ws.send(JSON.stringify(audioMessage));
        console.log("Fallback audio sent to Plivo.");
       
      } catch (fallbackError) {
        console.error("Error sending fallback audio:", fallbackError.message);
        ws.close();
      }
       
    }
    

    // ********* testing EEEEEEEnNNNNNNNNNDDDDDDDDDDD
    

      // if (data.event !== "media") return;
      
      // const streamId = storedStreamId || data.streamId;
      // if (!streamId) {
      //   console.error("Missing stream_id from Plivo. Cannot send response.");
      //   return;
      // }

      // console.log("Using stream_id:", streamId);

      // const audioChunk = Buffer.from(data.media.payload, "base64");
      // audioBufferStore.push(audioChunk);
      
      // // Wait until we have a significant amount of audio (~1 second worth)
      // if (audioBufferStore.length < 8) { // Adjust based on testing
      //   console.log("Collecting audio chunks...");
      //   return;
      // }
      
      // // Merge buffered chunks
      // const audioBuffer = Buffer.concat(audioBufferStore);
      // audioBufferStore = []; // Reset buffer after processing
      
      
      // // Check if the audio is mostly silence by analyzing Base64 data
      // if (audioBuffer.every(byte => byte === 0 || byte === 255)) {
      //   console.log("Silent audio detected. Skipping processing.");
      //   return;
      // }
      
      // fs.writeFileSync(audioFile, audioBuffer);

      // await new Promise((resolve, reject) => {
      //   ffmpeg(audioFile)
      //     .inputFormat("mulaw")
      //     .audioCodec("pcm_s16le")
      //     .audioChannels(1)
      //     .audioFrequency(16000)
      //     .toFormat("wav")
      //     .on("end", resolve)
      //     .on("error", reject)
      //     .save(wavFile);
      // });

      // const formData = new FormData();
      // formData.append("file", fs.createReadStream(wavFile));
      // formData.append("model", "whisper-1");
      // formData.append("language", "en");
      // formData.append("temperature", 0);

      // console.log('transcription started transcription started')
      // try {
       
      // const transcriptionResponse = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
      //   headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, ...formData.getHeaders() },
      // });

      // const transcription = transcriptionResponse.data.text;
      // console.log("Transcription:", transcription);

      // if (!transcription.trim()) {
      //   console.log("No speech detected. Skipping response generation.");
      //   return;
      // } 
      // } catch (error) {
      //  console.log('error in transcription', error.message); 
      // }

      // const aiResponse = await axios.post(
      //   "https://api.openai.com/v1/chat/completions",
      //   {
      //     model: "gpt-4o",
      //     messages: [{ role: "system", content: "You are an AI assistant." }, { role: "user", content: transcription }],
      //   },
      //   { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
      // );

      // const aiTextResponse = aiResponse.data.choices[0].message.content;
      // console.log("AI Response:", aiTextResponse);

      // const ttsResponse = await axios.post(
      //   "https://api.openai.com/v1/audio/speech",
      //   {
      //     model: "tts-1",
      //     input: aiTextResponse,
      //     voice: "alloy"
      //   },
      //   {
      //     headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      //     responseType: "arraybuffer",
      //   }
      // );
      // console.log("TTS audio generated.");

      // const clearAudioData = {
      //   event: "clearAudio",
      //   stream_id: streamId
      // };
      // ws.send(JSON.stringify(clearAudioData));
      // console.log("Sent clearAudio event to Plivo.");

      // const audioBufferResponse = Buffer.from(ttsResponse.data);
      // const audioMessage = {
      //   event: "media",
      //   stream_id: streamId,
      //   media: { payload: audioBufferResponse.toString("base64") }
      // };
      // ws.send(JSON.stringify(audioMessage));
      // console.log("Sent AI-generated speech back to Plivo.");
    
    } catch (error) {
      console.error("Error processing message:", error.message);
    } 
    // finally {
    //   try {
    //     if (!storedStreamId) {
    //       console.error("Cannot send audio to Plivo: Missing stream_id.");
    //       return;
    //     }

    //     // Convert output.wav to mulaw format
    //     console.log("Converting output.wav to mulaw format...");
    //     await new Promise((resolve, reject) => {
    //       ffmpeg("output.wav")
    //         .audioCodec("pcm_mulaw")
    //         .audioChannels(1)
    //         .audioFrequency(8000)
    //         .format("mulaw")
    //         .on("end", resolve)
    //         .on("error", reject)
    //         .save("output.mulaw");
    //     });

    //     console.log("Conversion completed. Sending fallback audio to Plivo...");
    //     const fallbackAudio = fs.readFileSync("output.mulaw");
        
    //     console.log("Sending fallback audio to Plivo...");
        
    //     const audioMessage = {
    //       event: "media",
    //       stream_id: storedStreamId,
    //       media: { payload: fallbackAudio.toString("base64") }
    //     };
    //     ws.send(JSON.stringify(audioMessage));
    //     console.log("Fallback audio sent to Plivo.");
        
    //   } catch (fallbackError) {
    //     console.error("Error sending fallback audio:", fallbackError.message);
    //     ws.close();
    //   }
    // }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
