import mongoose from "mongoose";


const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        default: 'folder'
    },
    parentFolderId: {
        type: mongoose.Types.ObjectId,
        default: null,
    }
})

const Folder = mongoose.models.folder || mongoose.model("folder", folderSchema);

export default Folder