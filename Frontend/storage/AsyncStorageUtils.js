// AsyncStorageUtils.js
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "MCSMA_token"; // Updated key to be valid

export const storeToken = async ({ token, userType, userID, name, email }) => {
  try {
    const data = JSON.stringify({ token, userType, userID, name, email });
    await SecureStore.setItemAsync(STORAGE_KEY, data);
    console.log("Token, userType, userID, name, and email stored securely");
  } catch (error) {
    console.error("Error storing token:", error);
    throw new Error("Failed to store token");
  }
};

export const getToken = async () => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEY);
    if (data) {
      const { token, userType, userID, name, email } = JSON.parse(data);
      console.log("Retrieved token, userType, userID, name, and email:", {
        token,
        userType,
        userID,
        name,
        email,
      });
      if (!userID) {
        console.log("Token not found or missing userId");
        return null;
      }
      return { token, userType, userID, name, email };
    }
    console.log("Token not found");
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    throw new Error("Failed to get token");
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing token:", error);
    throw new Error("Failed to remove token");
  }
};
