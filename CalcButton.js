import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const buttonStyles = {
  light: {
    backgroundColor: '#e0e0e0',
    textColor: '#000',
  },
  dark: {
    backgroundColor: '#424242',
    textColor: '#fff',
  },
  blue: {
    backgroundColor: '#90caf9',
    textColor: '#0d47a1',
  },
  green: {
    backgroundColor: '#81c784',
    textColor: '#1b5e20',
  },
};

export default function CalcButton({ value, onPress, theme }) {
  const currentButtonStyle = buttonStyles[theme] || buttonStyles.light;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: currentButtonStyle.backgroundColor }]}
      onPress={() => onPress(value)}
    >
      <Text
        style={[styles.buttonText, { color: currentButtonStyle.textColor }]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 10,
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
});