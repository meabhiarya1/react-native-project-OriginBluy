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
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
  const [loading, setLoading] = useState(false);

  // console.log(BACKEND_API)

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    console.log(BACKEND_API);
    if (!email) {
      Alert.alert("Validation Error", "Email is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API}/auth/forgot-password`, {
        email,
      });
      Alert.alert("OTP Sent", "Check your email for the OTP.");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      console.error(
        "OTP request error:",
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

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Validation Error", "OTP is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API}/auth/verify-otp`, {
        email,
        otp,
      });
      setResetToken(response.data.resetToken);
      Alert.alert("OTP Verified", "You can now reset your password.");
      setStep(3); // Move to password reset step
    } catch (error) {
      console.error(
        "OTP verification error:",
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

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Validation Error", "New password is required.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BACKEND_API}/auth/reset-password`, {
        email,
        newPassword,
        resetToken,
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

        {step === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleRequestOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Request OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
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
          </>
        )}
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
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
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
