import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const API_KEY = '35864ed5'; // Replace with your OMDB API key

export default function MovieDetailScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movie) return null;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300' }}
        style={styles.poster}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{movie.imdbRating}</Text>
          <Text style={styles.ratingText}>IMDb rating</Text>
        </View>

        <View style={styles.genreContainer}>
          {movie.Genre.split(', ').map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Plot</Text>
        <Text style={styles.plot}>{movie.Plot}</Text>

        <Text style={styles.sectionTitle}>Director</Text>
        <Text style={styles.info}>{movie.Director}</Text>

        <Text style={styles.sectionTitle}>Writers</Text>
        <Text style={styles.info}>{movie.Writer}</Text>

        <Text style={styles.sectionTitle}>Actors</Text>
        <Text style={styles.info}>{movie.Actors}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 450,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  year: {
    color: '#666',
    fontSize: 16,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  ratingText: {
    color: '#666',
    fontSize: 14,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  plot: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  info: {
    color: '#ccc',
    fontSize: 14,
  },
});