import DocumentActivity from "../models/documentActivity.model";

type LogActivityPayload = {
    documentId: string;
    userId: string;
    action: string;
    details?: string;
};

export const logActivity = async (payload: LogActivityPayload): Promise<void> => {
    try {
        await DocumentActivity.create(payload)
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to log activity:", error.message);
        }
    }
};
