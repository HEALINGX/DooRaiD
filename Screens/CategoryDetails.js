import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../Configs/Firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CategoryDetails({ route, navigation }) {
  const { subcollection, documentId } = route.params;
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for subcollection:", subcollection);
        const subcollectionRef = collection(db, 'Movie', documentId, subcollection);
        const querySnapshot = await getDocs(subcollectionRef);
        const docsData = querySnapshot.docs.map(doc => doc.data());
        console.log("Fetched data:", docsData);
        setMovies(docsData);
        setFilteredMovies(docsData); // Initialize filteredMovies with all movies
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [subcollection, documentId]);

  useEffect(() => {
    if (search) {
      const newData = movies.filter(item => 
        item.movie_name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMovies(newData);
    } else {
      setFilteredMovies(movies);
    }
  }, [search, movies]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Details', { item })}>
      <Image style={styles.image} source={{ uri: item.movie_image }} />
      <Text style={styles.title}>{item.movie_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        onChangeText={text => setSearch(text)}
        value={search}
      />
      <FlatList
        data={filteredMovies}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Set the number of columns to 2
        columnWrapperStyle={styles.columnWrapper} // Add styles for column layout
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1, // Allow items to grow and fill the space evenly
    maxWidth: '45%', // Ensure two items fit in one row
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: '100%', // Make the image responsive to the container width
    height: 200,
    borderRadius: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Space between columns
  },
});
