import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState('135');
  const barWeight = 45;
  const availablePlates = [45, 35, 25, 10, 5, 2.5];

  const calculatePlates = () => {
    let weightPerSide = (parseFloat(targetWeight) - barWeight) / 2;
    if (weightPerSide <= 0) return [];

    const plates = [];
    availablePlates.forEach(plate => {
      while (weightPerSide >= plate) {
        plates.push(plate);
        weightPerSide -= plate;
      }
    });
    return plates;
  };

  const platesNeeded = calculatePlates();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plate Calculator</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Target Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
          placeholder="e.g. 225"
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Plates per side (45lb bar):</Text>
        {platesNeeded.length === 0 ? (
          <Text style={styles.emptyText}>Just the bar!</Text>
        ) : (
          <View style={styles.plateRow}>
            {platesNeeded.map((plate, index) => (
              <View key={index} style={[styles.plate, { width: 40 + plate/2 }]}>
                <Text style={styles.plateText}>{plate}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  plateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plate: {
    height: 60,
    backgroundColor: '#333',
    borderRadius: 4,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#555',
  },
  plateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  }
});
