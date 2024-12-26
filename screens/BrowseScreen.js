import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '35864ed5';

export default function BrowseScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchMovies = async (query) => {
   
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://omdbapi.com/?s=${query}&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.Search) {
        setMovies(data.Search);
        
        saveToHistory(query);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
    searchMovies(searchQuery || 'marvel')
},[searchQuery])
useEffect(()=>{
    searchMovies('marvel')
},[])
  const saveToHistory = async (query) => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      const parsedHistory = history ? JSON.parse(history) : [];
      const newHistory = [query, ...parsedHistory.filter(item => item !== query)].slice(0, 10);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error(error);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate('MovieDetail', { imdbID: item.imdbID })}
    >
      <Image
        source={{ uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/150' }}
        style={styles.poster}
      />
      <Text style={styles.title} numberOfLines={2}>{item.Title}</Text>
      <Text style={styles.year}>{item.Year}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => searchMovies(searchQuery)}
        />
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.imdbID}
          numColumns={2}
          contentContainerStyle={styles.movieGrid}
        />
      )}
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
    padding: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    marginRight: 8,
  },
  historyButton: {
    padding: 8,
  },
  historyButtonText: {
    color: '#fff',
  },
  movieGrid: {
    padding: 8,
  },
  movieItem: {
    flex: 1,
    margin: 8,
    maxWidth: '50%',
  },
  poster: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  year: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});


