import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (provider) => {
    // This will redirect to OAuth provider
    const response = await api.get(`/auth/${provider}`);
    return response.data;
  },

  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const workoutAPI = {
  logWorkout: (data) => api.post('/workouts', data),
  getUserWorkouts: (limit = 50, offset = 0) =>
    api.get('/workouts/my-workouts', { params: { limit, offset } }),
  getRecentWorkouts: (limit = 20) =>
    api.get('/workouts/recent', { params: { limit } }),
  shareWorkout: (workoutId, message) =>
    api.post('/workouts/share', { workoutId, message }),
  deleteWorkout: (workoutId) =>
    api.delete(`/workouts/${workoutId}`),
};

export const friendAPI = {
  sendRequest: (friendId) =>
    api.post('/friends/request', { friendId }),
  acceptRequest: (friendId) =>
    api.post('/friends/accept', { friendId }),
  rejectRequest: (friendId) =>
    api.post('/friends/reject', { friendId }),
  removeFriend: (friendId) =>
    api.delete(`/friends/${friendId}`),
  getFriends: () =>
    api.get('/friends'),
  getPendingRequests: () =>
    api.get('/friends/pending'),
  getFriendWorkouts: () =>
    api.get('/friends/workouts'),
  getLeaderboard: (limit = 50) =>
    api.get('/friends/leaderboard', { params: { limit } }),
};

export default api;
