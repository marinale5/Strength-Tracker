import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LogWorkoutScreen from '../screens/LogWorkoutScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function WorkoutStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="WorkoutsList"
        component={WorkoutsScreen}
        options={{ title: 'My Workouts' }}
      />
    </Stack.Navigator>
  );
}

function LogWorkoutStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="LogWorkout"
        component={LogWorkoutScreen}
        options={{ title: 'Log Workout' }}
      />
    </Stack.Navigator>
  );
}

function LeaderboardStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="LeaderboardList"
        component={LeaderboardScreen}
        options={{ title: 'Leaderboard' }}
      />
    </Stack.Navigator>
  );
}

function FriendsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="FriendsList"
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator({ user, onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProfileView"
        component={() => <ProfileScreen user={user} onLogout={onLogout} />}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator({ user, onLogout }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarStyle: {
            borderTopColor: '#e0e0e0',
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}
      >
        <Tab.Screen
          name="Workouts"
          component={WorkoutStackNavigator}
          options={{
            tabBarLabel: 'Workouts',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💪</Text>,
          }}
        />
        <Tab.Screen
          name="LogWorkout"
          component={LogWorkoutStackNavigator}
          options={{
            tabBarLabel: 'Log',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>➕</Text>,
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardStackNavigator}
          options={{
            tabBarLabel: 'Leaderboard',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text>,
          }}
        />
        <Tab.Screen
          name="Friends"
          component={FriendsStackNavigator}
          options={{
            tabBarLabel: 'Friends',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text>,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={() => <ProfileStackNavigator user={user} onLogout={onLogout} />}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
