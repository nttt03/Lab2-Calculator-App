import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { evaluate } from 'mathjs';
import CalcButton from './CalcButton';

// Định nghĩa các chủ đề
const themes = {
  light: {
    backgroundColor: '#fff',
    textColor: '#000',
    borderColor: '#ccc',
    modalBackgroundColor: '#fff',
    historyCardBackground: '#f5f5f5',
    iconColor: '#333',
  },
  dark: {
    backgroundColor: '#121212',
    textColor: '#fff',
    borderColor: '#444',
    modalBackgroundColor: '#1e1e1e',
    historyCardBackground: '#333',
    iconColor: '#ccc',
  },
  blue: {
    backgroundColor: '#e3f2fd',
    textColor: '#0d47a1',
    borderColor: '#90caf9',
    modalBackgroundColor: '#bbdefb',
    historyCardBackground: '#90caf9',
    iconColor: '#1976d2',
  },
  green: {
    backgroundColor: '#e8f5e9',
    textColor: '#1b5e20',
    borderColor: '#81c784',
    modalBackgroundColor: '#c8e6c9',
    historyCardBackground: '#81c784',
    iconColor: '#388e3c',
  },
};

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  // const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handlePress = (value) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(expression.slice(0, -1));
    } else if (value === '=') {
      if (expression === '') {
        setResult('Error');
        return;
      }
      try {
        const calcResult = evaluate(expression).toString();
        setResult(calcResult);
        setHistory([...history, `${expression} = ${calcResult}`]);
      } catch (error) {
        setResult('Error');
      }
    } else {
      setExpression(expression + value);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleThemeModal = () => {
    setShowThemeModal(!showThemeModal);
  };

  const selectTheme = (newTheme) => {
    setTheme(newTheme);
    setShowThemeModal(false);
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', 'DEL'],
  ];

  const currentTheme = themes[theme]; // Lấy chủ đề hiện tại

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      {/* Header cố định ở phía trên */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleHistory}>
          <Entypo name="clock" size={24} color={currentTheme.iconColor} />
        </TouchableOpacity>
        {/* Theme */}
        <TouchableOpacity onPress={toggleThemeModal}>
          <Entypo name="light-up" size={24} color={currentTheme.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Nội dung chính: Biểu thức, kết quả, và grid nút */}
      <View style={styles.mainContent}>
        {/* Hiển thị biểu thức và kết quả */}
        <Text
          style={[styles.expression, { color: currentTheme.textColor }]}
        >
          {expression}
        </Text>
        <Text
          style={[styles.result, { color: currentTheme.textColor }]}
        >
          {result}
        </Text>

        {/* Grid các nút */}
        <View style={styles.buttonGrid}>
          {buttons.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((btn, btnIndex) => (
                <CalcButton
                  key={btnIndex}
                  value={btn}
                  onPress={handlePress}
                  theme={theme} // Truyền theme thay vì isDark
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Modal hiển thị lịch sử */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHistory}
        onRequestClose={toggleHistory}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.modalBackgroundColor },]}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTop}>
                <Text
                  style={[
                    styles.historyTitle,
                    { color: currentTheme.textColor }
                  ]}
                >
                  Lịch sử tính toán
                </Text>
                <TouchableOpacity onPress={toggleHistory}>
                  <Entypo
                    name="cross"
                    size={24}
                    color={currentTheme.iconColor}
                  />
                </TouchableOpacity>
              </View>
              {history.length > 0 && (
                <View style={styles.headerBottom}>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text
                      style={[
                        styles.clearHistory,
                      ]}
                    >
                      Xóa
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {history.length === 0 ? (
              <Text
                style={[
                  styles.emptyHistory,
                  { color: currentTheme.textColor }
                ]}
              >
                Chưa có lịch sử
              </Text>
            ) : (
              <FlatList
                data={history}
                renderItem={({ item }) => (
                  <View
                    style={[styles.historyCard, 
                      {
                        borderColor: currentTheme.borderColor,
                        backgroundColor: currentTheme.historyCardBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyItem,
                        { color: currentTheme.textColor }
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.historyList}
              />
            )}
          </View>
        </View>
      </Modal>
      {/* Modal chủ đề */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showThemeModal}
        onRequestClose={toggleThemeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.themeModalContent,
              { backgroundColor: currentTheme.modalBackgroundColor },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: currentTheme.textColor }]}
            >
              Chọn chủ đề
            </Text>
            <FlatList
              data={Object.keys(themes)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.themeOption}
                  onPress={() => selectTheme(item)}
                >
                  <Text
                    style={[styles.themeOptionText, { color: currentTheme.textColor }]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)} Theme
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity onPress={toggleThemeModal} style={styles.closeButton}>
              <Text
                style={[styles.closeButtonText, { color: currentTheme.textColor }]}
              >
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    width: '90%',
    minHeight: '90%',
  },
  themeModalContent: {
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalHeader: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearHistory: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  },
  historyList: {
    flexGrow: 0,
  },
  historyCard: {
    borderBottomWidth: 1,
    padding: 10,
  },
  historyItem: {
    fontSize: 20,
    textAlign: 'right',
  },
  emptyHistory: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  expression: {
    fontSize: 30,
    textAlign: 'right',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  themeOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 20,
  },
  buttonGrid: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});