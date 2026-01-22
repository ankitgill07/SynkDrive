import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        unique: true,
    },
    password: {
        type: String,
    },
    picture: {
        type: String,
        default: null,
    },
    rootFolderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    trems: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 12)
})



const Users = mongoose.model("user", userSchema)

export default Users