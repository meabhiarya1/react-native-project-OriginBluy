import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens2/LoginScreen';
import RegisterScreen from './screens2/RegisterScreen';
import CaptureScreen from './screens2/CaptureScreen';
import GalleryScreen from './screens2/GalleryScreen';
import ResetPasswordScreen from './screens2/ResetPasswordScreen';

const Stack = createStackNavigator();

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.welcomeText}>Media Capture and Storage Mobile Application</Text>
      </TouchableOpacity>
      <Text style={styles.copyright}>© MithunKumar</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  copyright: {
    marginTop: 50,
    fontSize: 12,
    color: '#555',
  },
});
