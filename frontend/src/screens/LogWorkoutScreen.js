import React, { useState, useRef } from 'react';
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
import RestTimer from '../components/RestTimer';

export default function LogWorkoutScreen({ onWorkoutLogged, route }) {
  const [loading, setLoading] = useState(false);
  const weightInput = useRef(null);
  const setsInput = useRef(null);
  const repsInput = useRef(null);

  const [formData, setFormData] = useState({
    exerciseName: template?.exercises[0]?.name || '',
    muscleGroup: 'Chest',
    equipment: '',
    weight: '',
    sets: template?.exercises[0]?.sets?.toString() || '',
    reps: template?.exercises[0]?.reps?.toString() || '',
    notes: '',
  });

  React.useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        exerciseName: template.exercises[0]?.name || '',
        sets: template.exercises[0]?.sets?.toString() || '',
        reps: template.exercises[0]?.reps?.toString() || '',
      }));
    }
  }, [template]);

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
        clientDate: new Date().toISOString(),
      });

      let alertMessage = response.data.message;
      if (response.data.pr) {
        alertMessage += "\n\n🏆 New Personal Record!";
      }
      if (response.data.achievements?.length > 0) {
        response.data.achievements.forEach(a => {
          alertMessage += `\n\n🌟 Achievement Unlocked: ${a.name}`;
        });
      }

      Alert.alert('Success', alertMessage);
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
        accessibilityLabel="Exercise Name"
        returnKeyType="next"
        onSubmitEditing={() => weightInput.current?.focus()}
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
            accessibilityRole="button"
            accessibilityLabel={muscle}
            accessibilityState={{ selected: formData.muscleGroup === muscle }}
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
            accessibilityRole="button"
            accessibilityLabel={equip}
            accessibilityState={{ selected: formData.equipment === equip }}
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
        ref={weightInput}
        style={styles.input}
        placeholder="e.g., 185"
        value={formData.weight}
        onChangeText={(text) => setFormData({ ...formData, weight: text })}
        keyboardType="decimal-pad"
        placeholderTextColor="#999"
        accessibilityLabel="Weight in pounds"
        returnKeyType="next"
        onSubmitEditing={() => setsInput.current?.focus()}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Sets *</Text>
          <TextInput
            ref={setsInput}
            style={styles.input}
            placeholder="3"
            value={formData.sets}
            onChangeText={(text) => setFormData({ ...formData, sets: text })}
            keyboardType="number-pad"
            placeholderTextColor="#999"
            accessibilityLabel="Number of sets"
            returnKeyType="next"
            onSubmitEditing={() => repsInput.current?.focus()}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Reps *</Text>
          <TextInput
            ref={repsInput}
            style={styles.input}
            placeholder="10"
            value={formData.reps}
            onChangeText={(text) => setFormData({ ...formData, reps: text })}
            keyboardType="number-pad"
            placeholderTextColor="#999"
            accessibilityLabel="Number of repetitions"
            returnKeyType="done"
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
        accessibilityLabel="Notes about the workout"
        returnKeyType="done"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogWorkout}
        disabled={loading}
        accessibilityRole="button"
        accessibilityHint="Submits your workout log"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log Workout</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Rest Timer</Text>
      <RestTimer initialSeconds={60} />
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
