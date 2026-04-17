import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from './src/api/client';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await SecureStore.deleteItemAsync('authToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (token, userData) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return isAuthenticated ? (
    <AppNavigator user={user} onLogout={handleLogout} refreshUser={refreshUser} />
  ) : (
    <AuthNavigator onLoginSuccess={handleLoginSuccess} />
  );
}
