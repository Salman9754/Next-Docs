export const generateUserColor = (userId: string) => {
    // List of nice colors
    const colors = [
        "#FF6B6B",  // Red
        "#4ECDC4",  // Teal
        "#45B7D1",  // Blue
        "#96CEB4",  // Green
        "#FFEAA7",  // Yellow
        "#DDA0DD",  // Plum
        "#98D8C8",  // Mint
        "#F7DC6F",  // Gold
        "#BB8FCE",  // Purple
        "#85C1E9",  // Light Blue
        "#F8B500",  // Orange
        "#00CED1"   // Dark Cyan
    ];

    // Create a simple hash from userId
    let hash = 0;
    const idString = userId.toString();

    for (let i = 0; i < idString.length; i++) {
        hash += idString.charCodeAt(i);
    }

    // Return color based on hash
    return colors[hash % colors.length];
};
