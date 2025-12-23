import mongoose from "mongoose";
import Document from "./document.model";
import User from "./user.model";

const documentPermissionSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Document,
        required: [true, "Document ID is required"]
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, "User ID is required"]
    },

    roles: {
        type: String,
        enum: ["viewer", "editor"],
        default: "viewer"
    }
}, { timestamps: true })


/**
 * Compound unique index
 * Ensures one user can have only ONE permission per document
 * Trying to add duplicate will throw error
 */

documentPermissionSchema.index({ documentId: 1, userId: 1 }, { unique: true })

const DocumentPermission = mongoose.model("DocumentPermission", documentPermissionSchema)
export default DocumentPermission