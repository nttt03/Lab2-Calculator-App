import React, { useEffect } from 'react'; // Thêm useEffect để tải âm thanh
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

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

    // Thêm logic cho âm thanh
    const [sound, setSound] = React.useState(null);

    async function loadSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(
              require('./assets/sounds/click.mp3') // Đảm bảo file âm thanh tồn tại
            );
            setSound(sound);
          } catch (error) {
            console.log('Error loading sound:', error); // Xử lý lỗi tải âm thanh
        }
    }

    async function playSound() {
        if (sound) {
        await sound.replayAsync(); // Phát lại âm thanh
        }
    }

    useEffect(() => {
        loadSound();
        return () => {
        if (sound) {
            sound.unloadAsync(); // Dọn dẹp âm thanh khi component unmount
        }
        };
    }, []);

    const handlePress = () => {
        playSound(); // Phát âm thanh
        onPress(value); // Gọi hàm onPress từ prop
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: currentButtonStyle.backgroundColor }]}
            onPress={handlePress}
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