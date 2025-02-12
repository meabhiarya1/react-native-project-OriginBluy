import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "MCSMA_token"; // Storage Key

// ✅ Store Token & User Details
export const storeToken = async ({ token, userType, userID, name, email }) => {
  try {
    const data = JSON.stringify({ token, userType, userID, name, email });
    await SecureStore.setItemAsync(STORAGE_KEY, data);
    console.log("Token stored securely");
  } catch (error) {
    console.error("SecureStore failed, using AsyncStorage:", error);
    await AsyncStorage.setItem(STORAGE_KEY, data);
  }
};

// ✅ Retrieve Token & User Details
export const getToken = async () => {
  try {
    let data = await SecureStore.getItemAsync(STORAGE_KEY);
    
    if (!data) {
      console.log("SecureStore empty, checking AsyncStorage...");
      data = await AsyncStorage.getItem(STORAGE_KEY);
    }

    if (data) {
      const { token, userType, userID, name, email } = JSON.parse(data);
      if (!token) {
        console.log("Invalid token");
        return null;
      }
      return { token, userType, userID, name, email };
    }

    console.log("No token found");
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null; // Prevent crashing if SecureStore fails
  }
};

// ✅ Remove Token from Storage
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};
