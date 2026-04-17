import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

export default function RestTimer({ initialSeconds = 60, onFinish }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      Vibration.vibrate([0, 500, 200, 500]);
      setIsActive(false);
      if (onFinish) onFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, isActive ? styles.stop : styles.start]} onPress={toggle}>
          <Text style={styles.buttonText}>{isActive ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.reset]} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginVertical: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  start: { backgroundColor: '#4CAF50' },
  stop: { backgroundColor: '#f44336' },
  reset: { backgroundColor: '#2196F3' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
