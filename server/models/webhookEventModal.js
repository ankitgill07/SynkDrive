import mongoose, { Schema } from "mongoose";

const webhookSchema = new mongoose.Schema({
 
})


const webhookEvent = mongoose.model("webhookEvent", webhookSchema)
export default webhookEvent