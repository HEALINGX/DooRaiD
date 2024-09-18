import { StatusBar } from 'expo-status-bar';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { db } from '../Configs/Firebase';
import { SearchBar } from 'react-native-elements';

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Movie"));
      const docsData = querySnapshot.docs.map(doc => doc.data());
      setData(docsData);
      setFilteredData(docsData);
    };
    fetchData();
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
    if (search) {
      const newData = data.filter((item) => {
        const itemData = item.movie_name ? item.movie_name.toUpperCase() : ''.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity style={styles.imageContainer} onPress={() => navigation.navigate('Details', { item })}>
        <Image style={styles.image} source={{ uri: item.movie_image }} />
      </TouchableOpacity>
      <Text style={styles.title} onPress={() => navigation.navigate('Details', { item })}>
        {"\n"}{item.movie_name}
      </Text>
    </View>
  );

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
