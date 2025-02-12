import React, { useState } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Video } from "expo-av";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons"; // For icons
import { BACKEND_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CaptureScreen({ route, navigation }) {
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [uploading, setUploading] = useState(false); // State to manage loading indicator
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to manage upload success

  // Retrieve user data from route params
  const { user } = route?.params || {};

  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity

  console.log(BACKEND_API);

  const openCamera = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access the camera is required!"
      );
      return;
    }

    // Launch camera (allows both image & video recording)
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allows both images and videos
      quality: 1,
      allowsEditing: false,
      videoMaxDuration: 60, // Allow max 60 sec video recording
      aspect: [4, 3],
    });

    console.log("Camera result:", result);

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType(result.assets[0].type);
      showSaveDialog(
        result.assets[0].uri,
        result.assets[0].type === "image" ? "image/jpeg" : "video/mp4"
      );
    }
  };

  const uploadMedia = async (uri, mimeType) => {
    if (uploading) return; // Prevent multiple uploads

    setUploading(true); // Lock upload button

    if (!user || !user?.token) {
      // Store media URI and type before navigating
      await AsyncStorage.setItem(
        "capturedMedia",
        JSON.stringify({ uri, mimeType })
      );

      Alert.alert("Authentication Required", "Please log in to upload media.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("media", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      type: mimeType,
      name: `media.${mimeType.split("/")[1]}`,
    });

    try {
      const response = await axios.post(
        `${BACKEND_API}/media/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Upload successful:", response?.data?.message);
      Alert.alert("Upload Success", "Media uploaded successfully!");
      setUploadSuccess(true);
    } catch (error) {
      console.error(
        "Error uploading media:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Upload Error",
        error.response?.data?.error ||
          "There was an issue uploading your media."
      );
    } finally {
      setUploading(false); // Unlock button after upload
    }
  };

  const showSaveDialog = (uri, mimeType) => {
    Alert.alert(
      "Save Media",
      `Do you want to save this ${mimeType.split("/")[0]} to your gallery?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setMediaUri(null),
        },
        {
          text: "Save",
          onPress: () => {
            setUploading(true); // Prevent multiple clicks
            uploadMedia(uri, mimeType);
          },
        },
      ]
    );
  };

  // Fade-in animation for the media container
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <FontAwesome name="camera" size={50} color="#f4a261" />
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("GalleryScreen")}
        >
          <FontAwesome name="photo" size={50} color="#2a9d8f" />
          <Text style={styles.buttonText}>Go to Gallery</Text>
        </TouchableOpacity>
      </View>
      {mediaUri && (
        <View style={styles.mediaContainer}>
          {mediaType === "video" ? (
            <Video
              source={{ uri: mediaUri }}
              style={styles.preview}
              useNativeControls
              resizeMode="contain"
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setMediaUri(null);
                navigation.navigate("GalleryScreen");
              }}
            >
              <Image source={{ uri: mediaUri }} style={styles.preview} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <Text style={styles.copyright}>© AbhishekKumar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefefe", // Light background color
  },
  buttonContainer: {
    flexDirection: "column", // Change to column for vertical layout
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    margin: 10,
    alignItems: "center",
  },
  buttonText: {
    marginTop: 5,
    fontSize: 16,
    color: "#333",
  },
  mediaContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  successIndicator: {
    marginTop: 10,
  },
  copyright: {
    position: "absolute",
    bottom: 10,
    fontSize: 12,
    color: "#888",
  },
});
