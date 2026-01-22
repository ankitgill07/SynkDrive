import mongoose from "mongoose";


const fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    extension: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: 'file'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    parentFolderId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
}, {
    timestamps: true,
})

const File = mongoose.model("file", fileSchema)

export default File