import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }) {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setSearchHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('Browse', { initialSearch: item })}
    >
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search History</Text>
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#ff3b30',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
  },
});