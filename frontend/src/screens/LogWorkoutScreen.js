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
import RestTimer from '../components/RestTimer';

export default function LogWorkoutScreen({ onWorkoutLogged, route }) {
  const [loading, setLoading] = useState(false);

  // Handle template selection
  const template = route?.params?.template;
  const isNewTemplate = route?.params?.isNewTemplate;

  const [formData, setFormData] = useState({
    exerciseName: template?.exercises[0]?.name || '',
    muscleGroup: 'Chest',
    equipment: '',
    weight: '',
    sets: template?.exercises[0]?.sets?.toString() || '',
    reps: template?.exercises[0]?.reps?.toString() || '',
    notes: '',
    saveAsTemplate: false,
    templateName: '',
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

      if (formData.saveAsTemplate && formData.templateName.trim()) {
        try {
          await workoutAPI.saveTemplate({
            name: formData.templateName,
            exercises: [{
              exerciseName: formData.exerciseName,
              sets: parseInt(formData.sets),
              reps: parseInt(formData.reps)
            }]
          });
          alertMessage += "\n\n📋 Routine saved!";
        } catch (e) {
          console.error("Failed to save template:", e);
        }
      }

      if (response.data.pr) {
        alertMessage += "\n\n🏆 New Personal Record!";
      }
      if (response.data.achievements?.length > 0) {
        response.data.achievements.forEach(a => {
          alertMessage += `\n\n🌟 Achievement Unlocked: ${a.name}`;
        });
      }

      Alert.alert('Success', alertMessage);
      if (onWorkoutLogged) onWorkoutLogged();
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

      {isNewTemplate || (
        <View style={styles.templateOptions}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setFormData({...formData, saveAsTemplate: !formData.saveAsTemplate})}
          >
            <Text style={styles.checkboxIcon}>{formData.saveAsTemplate ? '✅' : '⬜'}</Text>
            <Text style={styles.checkboxLabel}>Save as Routine?</Text>
          </TouchableOpacity>
          {formData.saveAsTemplate && (
            <TextInput
              style={styles.input}
              placeholder="Routine Name (e.g. Chest Day)"
              value={formData.templateName}
              onChangeText={(text) => setFormData({...formData, templateName: text})}
            />
          )}
        </View>
      )}

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

      <Text style={styles.label}>Rest Timer</Text>
      <RestTimer initialSeconds={60} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  templateOptions: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
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
