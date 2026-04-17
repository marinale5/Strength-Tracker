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
import AchievementsScreen from '../screens/AchievementsScreen';
import PersonalRecordsScreen from '../screens/PersonalRecordsScreen';
import PlateCalculator from '../screens/PlateCalculator';
import WorkoutTemplatesScreen from '../screens/WorkoutTemplatesScreen';

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

function LogWorkoutStackNavigator({ refreshUser }) {
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
        options={{ title: 'Log Workout' }}
      >
        {props => <LogWorkoutScreen {...props} onWorkoutLogged={refreshUser} />}
      </Stack.Screen>
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
        options={{ title: 'Profile' }}
      >
        {props => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ title: 'Achievements' }}
      />
      <Stack.Screen
        name="PersonalRecords"
        component={PersonalRecordsScreen}
        options={{ title: 'Personal Records' }}
      />
      <Stack.Screen
        name="PlateCalculator"
        component={PlateCalculator}
        options={{ title: 'Plate Calculator' }}
      />
      <Stack.Screen
        name="WorkoutTemplates"
        component={WorkoutTemplatesScreen}
        options={{ title: 'My Routines' }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator({ user, onLogout, refreshUser }) {
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
          options={{
            tabBarLabel: 'Log',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>➕</Text>,
          }}
        >
          {() => <LogWorkoutStackNavigator refreshUser={refreshUser} />}
        </Tab.Screen>
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
