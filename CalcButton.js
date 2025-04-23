import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CalcButton = ({ value, onPress, isDark }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isDark && styles.darkButton]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.buttonText, isDark && styles.darkText]}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 24,
  },
  darkText: {
    color: '#fff',
  },
});

export default CalcButton;