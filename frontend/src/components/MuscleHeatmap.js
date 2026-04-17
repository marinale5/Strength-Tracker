import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { gamificationAPI } from '../api/client';

export default function MuscleHeatmap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const fetchHeatmap = async () => {
    try {
      const response = await gamificationAPI.getMuscleHeatmap();
      setData(response.data);
    } catch (error) {
      console.error('Heatmap fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator color="#4CAF50" />;

  const maxVolume = Math.max(...data.map(d => parseFloat(d.total_volume)), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscle Volume (Last 30 Days)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const height = (parseFloat(item.total_volume) / maxVolume) * 150;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height: Math.max(height, 5) }]} />
                <Text style={styles.label}>{item.muscle_group}</Text>
                <Text style={styles.volume}>{Math.floor(item.total_volume/1000)}k</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 60,
  },
  bar: {
    width: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  volume: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  }
});
