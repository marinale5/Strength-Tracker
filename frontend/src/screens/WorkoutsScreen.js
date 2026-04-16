import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { workoutAPI } from '../api/client';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutAPI.getUserWorkouts();
      setWorkouts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    Alert.alert('Delete Workout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await workoutAPI.deleteWorkout(workoutId);
            setWorkouts(workouts.filter((w) => w.id !== workoutId));
            Alert.alert('Success', 'Workout deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete workout');
          }
        },
      },
    ]);
  };

  const handleShareWorkout = async (workoutId) => {
    try {
      await workoutAPI.shareWorkout(workoutId, '');
      Alert.alert('Success', 'Workout shared with your friends!');
    } catch (error) {
      Alert.alert('Error', 'Failed to share workout');
    }
  };

  const renderWorkout = ({ item }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View>
          <Text style={styles.exerciseName}>{item.exercise_name}</Text>
          <Text style={styles.muscleGroup}>{item.muscle_group}</Text>
        </View>
        <View style={styles.points}>
          <Text style={styles.pointsText}>+{item.points_earned} pts</Text>
        </View>
      </View>

      <View style={styles.workoutDetails}>
        {item.weight && (
          <Text style={styles.detail}>
            💪 {item.weight} {item.weight_unit}
          </Text>
        )}
        <Text style={styles.detail}>📊 {item.sets} x {item.reps}</Text>
        {item.equipment && (
          <Text style={styles.detail}>⚙️ {item.equipment}</Text>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}
          onPress={() => handleShareWorkout(item.id)}>
          <Text style={styles.actionText}>📤 Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteWorkout(item.id)}
        >
          <Text style={styles.actionText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Workouts</Text>
      {workouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No workouts yet. Start logging!</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  list: {
    paddingBottom: 32,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  muscleGroup: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  points: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutDetails: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
