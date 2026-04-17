import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { gamificationAPI } from '../api/client';

export default function AchievementsScreen() {
  const [loading, setLoading] = useState(true);
  const [earned, setEarned] = useState([]);
  const [all, setAll] = useState([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await gamificationAPI.getAchievements();
      setEarned(response.data.earned);
      setAll(response.data.all);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAchievement = ({ item }) => {
    const isEarned = earned.some(e => e.id === item.id);
    return (
      <View style={[styles.card, !isEarned && styles.lockedCard]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isEarned ? '🌟' : '🔒'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, !isEarned && styles.lockedText]}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {isEarned && item.points_awarded > 0 && (
            <Text style={styles.points}>+{item.points_awarded} pts</Text>
          )}
        </View>
      </View>
    );
  };

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
        data={all}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Achievements</Text>
            <Text style={styles.headerSubtitle}>
              Earned: {earned.length} / {all.length}
            </Text>
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
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
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
  lockedCard: {
    opacity: 0.6,
    backgroundColor: '#e0e0e0',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  points: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
