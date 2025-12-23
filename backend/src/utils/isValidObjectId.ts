export const isValidObjectId = (id: string) => {
    // ObjectId is 24 hex characters
    return /^[0-9a-fA-F]{24}$/.test(id);
};
