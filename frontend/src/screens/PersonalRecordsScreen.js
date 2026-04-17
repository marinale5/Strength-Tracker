import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { gamificationAPI } from '../api/client';

export default function PersonalRecordsScreen() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchPRs();
  }, []);

  const fetchPRs = async () => {
    try {
      const response = await gamificationAPI.getPRs();
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch PRs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPR = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.exerciseName}>{item.exercise_name}</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Best Weight</Text>
          <Text style={styles.statValue}>{item.best_weight} lbs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Best Set</Text>
          <Text style={styles.statValue}>{item.best_rep_count} reps @ {item.best_rep_weight} lbs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Max Tonnage</Text>
          <Text style={styles.statValue}>{item.max_tonnage} lbs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Est. 1RM</Text>
          <Text style={styles.statValue}>{parseFloat(item.estimated_one_rep_max).toFixed(1)} lbs</Text>
        </View>
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
      <FlatList
        data={records}
        renderItem={renderPR}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No records yet. Go lift something!</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
