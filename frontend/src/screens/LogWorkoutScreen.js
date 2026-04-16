import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { workoutAPI } from '../api/client';

export default function LogWorkoutScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exerciseName: '',
    muscleGroup: 'Chest',
    equipment: '',
    weight: '',
    sets: '',
    reps: '',
    notes: '',
  });

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const equipmentOptions = ['Barbell', 'Dumbbells', 'Cable Machine', 'Machine', 'Bodyweight'];

  const handleLogWorkout = async () => {
    if (!formData.exerciseName.trim() || !formData.sets || !formData.reps) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await workoutAPI.logWorkout({
        exerciseName: formData.exerciseName,
        muscleGroup: formData.muscleGroup,
        equipment: formData.equipment,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        sets: parseInt(formData.sets),
        reps: parseInt(formData.reps),
        notes: formData.notes,
      });

      Alert.alert('Success', response.data.message);
      // Clear form
      setFormData({
        exerciseName: '',
        muscleGroup: 'Chest',
        equipment: '',
        weight: '',
        sets: '',
        reps: '',
        notes: '',
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log a Workout</Text>

      <Text style={styles.label}>Exercise Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Bench Press"
        value={formData.exerciseName}
        onChangeText={(text) =>
          setFormData({ ...formData, exerciseName: text })
        }
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Muscle Group *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.buttonGroup}
      >
        {muscleGroups.map((muscle) => (
          <TouchableOpacity
            key={muscle}
            style={[
              styles.groupButton,
              formData.muscleGroup === muscle && styles.groupButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, muscleGroup: muscle })}
          >
            <Text
              style={[
                styles.groupButtonText,
                formData.muscleGroup === muscle && styles.groupButtonTextActive,
              ]}
            >
              {muscle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Equipment</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.buttonGroup}
      >
        {equipmentOptions.map((equip) => (
          <TouchableOpacity
            key={equip}
            style={[
              styles.groupButton,
              formData.equipment === equip && styles.groupButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, equipment: equip })}
          >
            <Text
              style={[
                styles.groupButtonText,
                formData.equipment === equip && styles.groupButtonTextActive,
              ]}
            >
              {equip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Weight (lbs)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 185"
        value={formData.weight}
        onChangeText={(text) => setFormData({ ...formData, weight: text })}
        keyboardType="decimal-pad"
        placeholderTextColor="#999"
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Sets *</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            value={formData.sets}
            onChangeText={(text) => setFormData({ ...formData, sets: text })}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Reps *</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            value={formData.reps}
            onChangeText={(text) => setFormData({ ...formData, reps: text })}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Add notes about your workout..."
        value={formData.notes}
        onChangeText={(text) => setFormData({ ...formData, notes: text })}
        multiline
        numberOfLines={4}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogWorkout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log Workout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  buttonGroup: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  groupButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  groupButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  groupButtonTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
