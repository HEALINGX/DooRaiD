import { StatusBar } from 'expo-status-bar';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { db } from '../Configs/Firebase';
import { Button, SearchBar } from 'react-native-elements';
import { useAuth } from '../context/AuthContext';

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState(null);
  const auth = useAuth();

  const fetchData = async () => {
    let allMovies = [];

    const movieCollection = collection(db, "Movie");
    const movieSnapshot = await getDocs(movieCollection);

    for (const doc of movieSnapshot.docs) {
      const docData = doc.data();

      // Fetch Hot_movie subcollection data
      const subcollectionRef = collection(db, "Movie", doc.id, 'Hot_movie');
      const subcollectionSnapshot = await getDocs(subcollectionRef);
      const subcollectionData = subcollectionSnapshot.docs.map(subDoc => subDoc.data());

      allMovies = [...allMovies, ...subcollectionData];
    }

    setData(allMovies);
    setFilteredData(allMovies);
  };

  const fetchUserRole = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role);  // Fetch and set the user's role
        console.log("User role:", userData.role);
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserRole();  // Fetch role when the component mounts
  }, []);

  const fetchAllMovies = async () => {
    let allMovies = [];

    const movieCollection = collection(db, "Movie");
    const movieSnapshot = await getDocs(movieCollection);

    for (const doc of movieSnapshot.docs) {
      const docData = doc.data();

      // Add main document data
      allMovies.push({ id: doc.id, ...docData });

      // Fetch subcollection data
      const subcollections = ['Hot_movie', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance'];
      for (const subcollection of subcollections) {
        const subcollectionRef = collection(db, "Movie", doc.id, subcollection);
        const subcollectionSnapshot = await getDocs(subcollectionRef);
        const subcollectionData = subcollectionSnapshot.docs.map(subDoc => subDoc.data());
        allMovies = [...allMovies, ...subcollectionData];
      }
    }

    return allMovies;
  };

  const updateSearch = async (search) => {
    setSearch(search);

    if (search) {
      const allMovies = await fetchAllMovies();
      const newData = allMovies.filter((item) => {
        const itemData = item.movie_name ? item.movie_name.toUpperCase() : ''.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      fetchData();
    }
  };

  const renderItem = ({ item }) => {
    // Check if item has required properties
    if (!item.movie_image || !item.movie_name) {
      return null;
    }

    return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.imageContainer} onPress={() => navigation.navigate('Details', { item })}>
          <Image style={styles.image} source={{ uri: item.movie_image }} />
        </TouchableOpacity>
        <Text style={styles.title} onPress={() => navigation.navigate('Details', { item })}>
          {"\n"}{item.movie_name}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
        placeholderTextColor="#fff"
        containerStyle={styles.searchContainer}
        lightTheme
        round
      />
      <FlatList
        data={filteredData}
        horizontal={true}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 60,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 5,
    marginVertical: 25,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    width: 300,
    height: 400,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 20,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
  },
});