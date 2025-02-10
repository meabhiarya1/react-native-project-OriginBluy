import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        {/* <Text style={styles.title}>MCSMA</Text> */}
        <Text style={styles.subtitle}>Mobile Capture and Storage Management Application</Text>
      </View>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => navigation.navigate('CaptureScreen')}
      >
        <FontAwesome name="camera" size={50} color="#fff" />
        <Text style={styles.captureButtonText}>Capture Screen</Text>
      </TouchableOpacity>
      <Text style={styles.copyright}>© Abhishek</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 16,
    alignItems: 'center',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'lightblue', // Ensure background color matches container
    zIndex: 1, // Ensures buttons stay above other elements
  },
  topButton: {
    backgroundColor: '#f4a261',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginTop: 120, // Adjusted to create space between the title and top buttons
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    textShadowColor: '#f4a261',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: '#f4a261',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    marginVertical: 30,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  copyright: {
    marginTop: 50,
    fontSize: 12,
    color: '#555',
  },
});
