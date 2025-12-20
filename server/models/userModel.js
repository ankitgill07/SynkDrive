import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        pattern: /\b/,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    }
},{
    timestamps : true
})


const Users = new mongoose.model("user" , userSchema)

export default Users