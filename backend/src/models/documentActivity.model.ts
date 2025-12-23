import mongoose from "mongoose";
import Document from "./document.model";
import User from "./user.model";

const documentActivitySchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Document,
        required: [true, "Document ID is required"]
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },

    action: {
        type: String,
        enum: ["create", "view", "edit", "join", "leave", "invite", "delete"],
        required: [true, "Action is required"]
    },

    details: {
        type: String,
        default: ""
    }
}, { timestamps: true })

// Get activities for a document
documentActivitySchema.index({ documentId: 1, createdAt: 1 })

// Get activities by a user
documentActivitySchema.index({ userId: 1, createdAt: -1 });

const DocumentActivity = mongoose.model("DocumentActivity", documentActivitySchema)
export default DocumentActivity