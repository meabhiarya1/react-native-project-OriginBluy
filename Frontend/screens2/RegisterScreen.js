import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; // For icons
import { storeToken } from '../storage/AsyncStorageUtils';
import { BACKEND_API } from "@env";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleRegister = async () => {
        if (!username) {
            Alert.alert('Validation Error', 'Username is required.');
            return;
        }
        if (!email) {
            Alert.alert('Validation Error', 'Email is required.');
            return;
        }
        if (!password) {
            Alert.alert('Validation Error', 'Password is required.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
            return;
        }

        setLoading(true); // Show loading indicator
        console.log(BACKEND_API)
        try {
            const response = await axios.post(`${BACKEND_API}/auth/register`, {
                username,
                email,
                password,
            });
            const { token, user } = response.data;

            if (token && user) {
                await storeToken({
                    token,
                    userType: 'user',
                    userID: user._id,
                    name: user.username,
                    email,
                });
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data?.error || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>User Registration</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="envelope" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.redirectText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        padding: 16,
    },
    card: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        width: '100%',
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    icon: {
        marginRight: 10,
    },
    iconButton: {
        position: 'absolute',
        right: 0,
        padding: 10,
    },
    button: {
        backgroundColor: '#f4a261',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    redirectText: {
        marginTop: 20,
        color: 'blue',
    },
});
