
import mongoose from "mongoose";

const voiceCallSchenam = new mongoose.Schema({
    name: String,
    customerNumber: String,
    forwardFrom: String,
    toNumber: String,
    spam: Boolean,
    summary: String,
    callDuration: String,
    email: String,
    voiceUrl: String,
    transcript: String,
    endedReason: String,
    startedAt: String,
    endedAt: String
})

export const VoiceCall = mongoose.model("VoiceCall", voiceCallSchenam);