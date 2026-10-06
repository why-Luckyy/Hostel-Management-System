import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Keys used to store authentication data in device storage
const TOKEN_KEY = 'hms_auth_token';
const USER_KEY = 'hms_auth_user';

/**
 * Storage Helper using Expo SecureStore
 * (Stores sensitive data like JWT encrypted on iOS Keychain / Android KeyStore)
 * Also includes a safe fallback for web/testing.
 */

// Save JWT token
export const saveToken = async (token) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Retrieve JWT token
export const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error reading token:', error);
    return null;
  }
};

// Delete JWT token
export const removeToken = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Save logged-in user details (name, email, role)
export const saveUser = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    if (Platform.OS === 'web') {
      localStorage.setItem(USER_KEY, jsonValue);
      return;
    }
    await SecureStore.setItemAsync(USER_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Retrieve logged-in user details
export const getUser = async () => {
  try {
    let jsonValue;
    if (Platform.OS === 'web') {
      jsonValue = localStorage.getItem(USER_KEY);
    } else {
      jsonValue = await SecureStore.getItemAsync(USER_KEY);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
};

// Clear both token and user upon logout
export const clearAuth = async () => {
  try {
    await removeToken();
    if (Platform.OS === 'web') {
      localStorage.removeItem(USER_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};
