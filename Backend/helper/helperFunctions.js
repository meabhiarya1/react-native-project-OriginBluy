// Helper function to check file extension
export const isValidFile = (fileName, mimeType) => {
  const ext = fileName.toLowerCase().split(".").pop();
  return (
    ((ext === "jpg" || ext === "jpeg") && mimeType.startsWith("image/")) ||
    (ext === "mp4" && mimeType === "video/mp4")
  );
};
