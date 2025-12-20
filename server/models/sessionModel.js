import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
        eexpires: 3600
    }
})


const Sessions = mongoose.model("session", sessionSchema) 

export default Sessions