import mongoose, { Schema } from "mongoose";

const webhookSchema = new mongoose.Schema({
 
}, { bufferCommands: false })


const webhookEvent = mongoose.model("webhookEvent", webhookSchema)
export default webhookEvent