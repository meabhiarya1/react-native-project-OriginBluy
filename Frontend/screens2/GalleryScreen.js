import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import { getToken } from "../storage/AsyncStorageUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { BACKEND_API } from "@env";

export default function GalleryScreen() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [authenticated, setAuthenticated] = useState(true); // State to track authentication

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { token, userID } = await getToken();

        if (!token || !userID || typeof token !== "string") {
          setAuthenticated(false);
          setError(null); // Clear error state if user is not authenticated
          return;
        }

        // Fetch media
        const { data } = await axios.get(`${BACKEND_API}/media/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched media data:", data); // Log the fetched media data

        if (Array.isArray(data) && data.length > 0) {
          setMedia(data);
        } else {
          console.log("No media found for this user."); // Log if no media is found
        }
      } catch (error) {
        console.error(
          "Error fetching media:",
          error.response ? error.response.data : error.message
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleDelete = async (url) => {
    try {
      const { token, userID } = await getToken();

      if (!token || !userID) {
        Alert.alert("Authentication Error", "Please log in to delete media.");
        return;
      }

      await axios.delete(`${BACKEND_API}/media/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          uris: [url], // Send URL in the body as an array
        },
      });

      setMedia(media.filter((item) => item.url !== url));
    } catch (error) {
      console.error(
        "Error deleting media:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Delete Error",
        "Failed to delete the media. Please try again."
      );
    }
  };

  const handleImagePress = (url) => {
    setSelectedImage(url);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const confirmDelete = (url) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this image? Once deleted, it cannot be restored.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(url),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : !authenticated ? (
        <Text style={styles.errorText}>
          Empty gallery, please login and access images.
        </Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : media.length === 0 ? (
        <Text style={styles.noMediaText}>No media found.</Text>
      ) : (
        <FlatList
          data={media}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.mediaContainer}>
              <TouchableOpacity onPress={() => handleImagePress(item.url)}>
                <Image source={{ uri: item.url }} style={styles.mediaImage} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDelete(item.url)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal visible={!!selectedImage} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullscreenImage}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaContainer: {
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "#fff", // Optional: To ensure shadow visibility on both iOS and Android
    borderRadius: 10, // Optional: To round the corners of the shadow
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10, // Optional: To match the rounded corners of the shadow
  },
  deleteButton: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    margin: 20,
    textAlign: "center",
  },
  noMediaText: {
    fontSize: 16,
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "70%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
