import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api/client';

export default function BossBattle() {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveGoal();
  }, []);

  const fetchActiveGoal = async () => {
    try {
      const response = await api.get('/gamification/active-goals');
      setGoal(response.data[0]);
    } catch (error) {
      console.error('Failed to fetch boss battle:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator color="#4CAF50" />;
  if (!goal) return null;

  const progress = (goal.current_value / goal.target_value) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐲 BOSS BATTLE: {goal.title}</Text>
      <Text style={styles.description}>{goal.description}</Text>

      <View
        style={styles.progressContainer}
        accessibilityRole="progressbar"
        accessibilityLabel={`Boss Battle Progress: ${goal.title}`}
        accessibilityValue={{
          min: 0,
          max: goal.target_value,
          now: goal.current_value,
          text: `${Math.floor(progress)}%`,
        }}
      >
        <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>{Math.floor(goal.current_value)} / {goal.target_value} {goal.metric}</Text>
        <Text style={styles.statsText}>{Math.floor(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 16,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#555',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
