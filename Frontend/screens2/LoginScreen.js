import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons"; // For icons
import { storeToken } from "../storage/AsyncStorageUtils";
import { BACKEND_API } from "@env";

export default function LoginScreen({ navigation }) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleLogin = async () => {
    console.log(BACKEND_API)
    if (!emailOrUsername) {
      Alert.alert("Validation Error", "Email or Username is required.");
      return;
    }
    if (!password) {
      Alert.alert("Validation Error", "Password is required.");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post(`${BACKEND_API}/auth/login`, {
        emailOrUsername,
        password,
      });
      const { token, user } = response.data;

      await storeToken({
        token,
        userType: "user",
        userID: user._id,
        name: user.username,
        email: user.email,
      });

      // Show success dialog
      Alert.alert("Login Successful", "You have successfully logged in!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("CaptureScreen", {
              user: {
                token,
                userType: "user",
                userID: user._id,
                name: user.username,
                email: user.email,
              },
            });
            navigation.navigate("GalleryScreen", {
              user: {
                token,
                userType: "user",
                userID: user._id,
                name: user.username,
                email: user.email,
              },
            });
          },
        },
      ]);
    } catch (error) {
      // console.error("Login error:", error); // Log the full error object
      Alert.alert(
        "Login Failed",
        error.response ? error.response.data.error : "An error occurred",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>User Login</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.redirectText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 16,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#f4a261",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  redirectText: {
    marginTop: 20,
    color: "blue",
  },
  forgotPasswordText: {
    marginTop: 10,
    color: "red",
  },
});
