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
import { BACKEND_API } from "@env";

export default function ResetPasswordScreen({ navigation }) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateToken = async () => {
    if (!emailOrUsername) {
      Alert.alert("Validation Error", "Email or Username is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_API}/auth/generate-reset-token`,
        { emailOrUsername }
      );
      const { token } = response.data;
      setToken(token);
      Alert.alert("Token Generated", "A reset token has been generated.");
    } catch (error) {
      console.error(
        "Token generation error:",
        error.response ? error.response.data.error : error.message
      );
      Alert.alert(
        "Error",
        error.response ? error.response.data.error : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token || !newPassword) {
      Alert.alert("Validation Error", "Token and new password are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_API}/auth/reset-password`, {
        token,
        newPassword,
      });
      Alert.alert("Success", "Your password has been reset successfully.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.error(
        "Password reset error:",
        error.response ? error.response.data.error : error.message
      );
      Alert.alert(
        "Error",
        error.response ? error.response.data.error : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleGenerateToken}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Generate Token</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Reset Token"
            value={token}
            onChangeText={setToken}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
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
    elevation: 5,
    shadowColor: "#000",
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
    width: "100%",
    marginBottom: 15,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
});
