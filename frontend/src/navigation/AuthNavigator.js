import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../api/client';

const Stack = createNativeStackNavigator();

export function AuthNavigator({ onLoginSuccess }) {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // In a real app, this would open the OAuth flow
      // For now, we'll show a placeholder
      Alert.alert(
        'Google Login',
        'This would open Google OAuth in a real app. Check backend setup.'
      );
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      // In a real app, this would open the OAuth flow
      Alert.alert(
        'GitHub Login',
        'This would open GitHub OAuth in a real app. Check backend setup.'
      );
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen">
          {() => (
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.emoji}>💪</Text>
                <Text style={styles.title}>Strength Tracker</Text>
                <Text style={styles.subtitle}>
                  Log workouts • Earn points • Compete with friends
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.loginButton, styles.googleButton, loading && styles.disabled]}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.buttonEmoji}>📧</Text>
                      <Text style={styles.buttonText}>Login with Google</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.loginButton, styles.githubButton, loading && styles.disabled]}
                  onPress={handleGithubLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.buttonEmoji}>🐙</Text>
                      <Text style={styles.buttonText}>Login with GitHub</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.features}>
                <Text style={styles.featureTitle}>Features:</Text>
                <Text style={styles.feature}>✅ Track all your workouts</Text>
                <Text style={styles.feature}>✅ Earn points & level up</Text>
                <Text style={styles.feature}>✅ Share with friends</Text>
                <Text style={styles.feature}>✅ Climb the leaderboard</Text>
              </View>
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  githubButton: {
    backgroundColor: '#24292e',
  },
  buttonEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
  features: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  feature: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
});
