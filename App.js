import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { evaluate } from 'mathjs';
import CalcButton from './CalcButton';

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', 'DEL'],
  ];

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header cố định ở phía trên */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleHistory}>
          <Entypo name="clock" size={24} color={isDark ? '#ccc' : '#333'} />
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Entypo name="light-up" size={24} color={isDark ? '#ccc' : '#333'} />
          <Switch value={isDark} onValueChange={() => setIsDark(!isDark)} />
          <Entypo name="moon" size={24} color={isDark ? '#ccc' : '#333'} />
        </View>
      </View>

      {/* Nội dung chính: Biểu thức, kết quả, và grid nút */}
      <View style={styles.mainContent}>
        {/* Hiển thị biểu thức và kết quả */}
        <Text
          style={[styles.expression, isDark ? styles.darkText : styles.lightText]}
        >
          {expression}
        </Text>
        <Text
          style={[styles.result, isDark ? styles.darkText : styles.lightText]}
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
                  isDark={isDark}
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
          <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTop}>
                <Text
                  style={[
                    styles.historyTitle,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  Lịch sử tính toán
                </Text>
                <TouchableOpacity onPress={toggleHistory}>
                  <Entypo
                    name="cross"
                    size={24}
                    color={isDark ? '#ccc' : '#333'}
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
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Chưa có lịch sử
              </Text>
            ) : (
              <FlatList
                data={history}
                renderItem={({ item }) => (
                  <View
                    style={[styles.historyCard, isDark && styles.darkHistoryCard]}
                  >
                    <Text
                      style={[
                        styles.historyItem,
                        isDark ? styles.darkText : styles.lightText,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    width: '90%',
    minHeight: '90%',
  },
  darkModalContent: {
    backgroundColor: '#1e1e1e',
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
    borderColor: '#ccc',
    padding: 10,
  },
  darkHistoryCard: {
    borderColor: '#444',
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
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
});