import { db } from '../Configs/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';


export default function Details({ route }) {
  const { item } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Movie"));
      const docsData = querySnapshot.docs.map(doc => doc.data());
      setData(docsData);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: item.movie_image }} />
      <Text style={styles.title}>{item.movie_name}</Text>
      <Text>{item.movie_description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 300,
    marginBottom: 16,
  },
});
