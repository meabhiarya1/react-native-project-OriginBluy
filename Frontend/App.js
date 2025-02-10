import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens2/LoginScreen";
import RegisterScreen from "./screens2/RegisterScreen";
import CaptureScreen from "./screens2/CaptureScreen";
import GalleryScreen from "./screens2/GalleryScreen";
import ResetPasswordScreen from "./screens2/ResetPasswordScreen";

const Stack = createStackNavigator();

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.welcomeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.welcomeText}>Start App</Text>
      </TouchableOpacity>
      <Text style={styles.copyright}>© Abhishek</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: "#007bff" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="CaptureScreen" component={CaptureScreen} />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
    padding: 20,
  },
  welcomeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 5, // Adds a subtle shadow on Android
    shadowColor: "#000", // Adds a shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    cursor: "pointer",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    cursor: "pointer",
  },
  copyright: {
    marginTop: 50,
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
});
