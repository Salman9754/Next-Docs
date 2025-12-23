import mongoose from "mongoose";
import Document from "./document.model";
import User from "./user.model";

const documentVersionSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Document,
        required: [true, "Document ID is required"],
    },

    content: {
        type: String,
        required: [true, "Content is required"]
    },

    savedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, "User ID is required"]
    }
}, { timestamps: true })

// for faster get the versions of documents
documentVersionSchema.index({ documentId: 1, createdAt: -1 })

const DocumentVersion = mongoose.model("DocumentVersion", documentVersionSchema)
export default DocumentVersion