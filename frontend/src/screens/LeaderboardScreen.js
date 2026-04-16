import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { friendAPI } from '../api/client';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await friendAPI.getLeaderboard(100);
      setLeaderboard(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const renderUser = ({ item, index }) => (
    <View style={styles.userCard}>
      <Text style={styles.medal}>{getMedalEmoji(index + 1)}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.level}>Level {item.level}</Text>
      </View>
      <View style={styles.points}>
        <Text style={styles.pointsNumber}>{item.points}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
      <Text style={styles.workoutCount}>{item.workout_count}💪</Text>
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
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        scrollEnabled={true}
      />
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
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medal: {
    fontSize: 24,
    marginRight: 12,
    minWidth: 32,
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  level: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  points: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  pointsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#888',
  },
  workoutCount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
