import mongoose, { Schema } from "mongoose";



const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    }
})


const OTP = mongoose.model("otp", otpSchema)
export default OTP