import axios from 'axios';
import { getToken } from './storage';

// Base API URL from environment variable or localhost fallback
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Axios instance configured for the Hostel Management System backend.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request Interceptor: Automatically attaches JWT Bearer token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error attaching auth token to request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Helper to extract user-friendly error messages from backend responses.
 * Great for explaining error handling in a college viva!
 */
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return 'Unable to reach backend server. Please check your network and ensure the backend is running.';
  }
  return error.message || 'An unexpected error occurred.';
};

export default api;
