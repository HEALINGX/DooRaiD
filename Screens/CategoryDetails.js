import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Button, Modal, ScrollView } from 'react-native';
import { db } from '../Configs/Firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Assuming you have a context for authentication

export default function CategoryDetails({ route, navigation }) {
  const { subcollection, documentId, category } = route.params;
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [role, setRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newMovie, setNewMovie] = useState({
    movie_name: '',
    movie_image: '',
    movie_des: '',
    Actor01: '',
    Actor02: '',
    Actor03: '',
    Actor04: '',
    Ac01_pic: '',
    Ac02_pic: '',
    Ac03_pic: '',
    Ac04_pic: ''
  });
  const auth = useAuth(); // Use the authentication context to get the current user

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid); // Reference to the user's document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role); // Assuming role is stored in userData.role
          console.log("User role:", userData.role);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (auth.currentUser) {
      fetchUserRole();
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for subcollection:", subcollection);
        const subcollectionRef = collection(db, 'Movie', documentId, subcollection);
        const querySnapshot = await getDocs(subcollectionRef);
        const docsData = querySnapshot.docs.map(doc => doc.data());
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

  const addMovie = async () => {
    try {
      const newMovieDocRef = doc(db, `Movie/${documentId}/${category}/${newMovie.movie_name}`);
      await setDoc(newMovieDocRef, newMovie);
      setMovies([...movies, newMovie]);
      setFilteredMovies([...movies, newMovie]);
      setModalVisible(false); // Close modal after adding
  
      // Reset form after adding the movie
      setNewMovie({
        movie_name: '',
        movie_image: '',
        movie_des: '',
        Actor01: '',
        Actor02: '',
        Actor03: '',
        Actor04: '',
        Ac01_pic: '',
        Ac02_pic: '',
        Ac03_pic: '',
        Ac04_pic: ''
      });
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}  
      onPress={() => 
        navigation.navigate('Details', { 
          item, 
          userRole: role, 
          documentId, 
          category, 
          movie_name: item.movie_name // Pass the movie name here
        })
      }
    >
      <Image style={styles.image} source={{ uri: item.movie_image }} />
      <Text style={styles.title}>{item.movie_name}</Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      {role && <Text style={styles.roleText}>Role: {role}</Text>}
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        onChangeText={text => setSearch(text)}
        value={search}
      />
      {role === 'admin' && (
        <>
          <Button title="+" onPress={() => setModalVisible(true)} />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.modalTitle}>Add New Movie</Text>

                <Text style={styles.label}>Movie Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Movie Name"
                  value={newMovie.movie_name}
                  onChangeText={text => setNewMovie({ ...newMovie, movie_name: text })}
                />

                <Text style={styles.label}>Movie Image URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Movie Image URL"
                  value={newMovie.movie_image}
                  onChangeText={text => setNewMovie({ ...newMovie, movie_image: text })}
                />

                <Text style={styles.label}>Movie Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Movie Description"
                  value={newMovie.movie_des}
                  onChangeText={text => setNewMovie({ ...newMovie, movie_des: text })}
                />

                <Text style={styles.label}>Actor 1</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 1"
                  value={newMovie.Actor01}
                  onChangeText={text => setNewMovie({ ...newMovie, Actor01: text })}
                />

                <Text style={styles.label}>Actor 1 Image URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 1 Image URL"
                  value={newMovie.Ac01_pic}
                  onChangeText={text => setNewMovie({ ...newMovie, Ac01_pic: text })}
                />

                <Text style={styles.label}>Actor 2</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 2"
                  value={newMovie.Actor02}
                  onChangeText={text => setNewMovie({ ...newMovie, Actor02: text })}
                />

                <Text style={styles.label}>Actor 2 Image URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 2 Image URL"
                  value={newMovie.Ac02_pic}
                  onChangeText={text => setNewMovie({ ...newMovie, Ac02_pic: text })}
                />

                <Text style={styles.label}>Actor 3</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 3"
                  value={newMovie.Actor03}
                  onChangeText={text => setNewMovie({ ...newMovie, Actor03: text })}
                />

                <Text style={styles.label}>Actor 3 Image URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 3 Image URL"
                  value={newMovie.Ac03_pic}
                  onChangeText={text => setNewMovie({ ...newMovie, Ac03_pic: text })}
                />

                <Text style={styles.label}>Actor 4</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 4"
                  value={newMovie.Actor04}
                  onChangeText={text => setNewMovie({ ...newMovie, Actor04: text })}
                />

                <Text style={styles.label}>Actor 4 Image URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Actor 4 Image URL"
                  value={newMovie.Ac04_pic}
                  onChangeText={text => setNewMovie({ ...newMovie, Ac04_pic: text })}
                />

                <Button style={styles.addMovie} title="Add Movie" onPress={addMovie} />
                <Button style={styles.cancleMovie} title="Cancel" onPress={() => setModalVisible(false)} />
              </ScrollView>
            </View>
          </Modal>
        </>
      )}
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
    marginBottom: 50,
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: 250,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addmovie: {
    marginBottom: 10,
  },
  cancleMovie: {
    marginTop: 10,
  }
});
