import mongoose from "mongoose";
import User from "./user.model";

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Document title is required"],
        trim: true,
        maxLength: [120, "Max 120 characters allowed"],
        default: "Untitled document"
    },

    content: {
        type: String,
        default: ""
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },

    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }],

    isPublic: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

// Index on owner - faster queries for "find my documents"
documentSchema.index({ owner: 1 })

// Index on collaborators - faster queries for "find shared documents"
documentSchema.index({ collaborators: 1 })

// Index on updatedAt - faster sorting by recent
documentSchema.index({ updatedAt: -1 })

const Document = mongoose.model("Document", documentSchema)
export default Document