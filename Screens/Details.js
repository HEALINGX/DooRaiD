import { db } from '../Configs/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Movie Image */}
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: item.movie_image }} />
        </View>

        {/* Actors Container */}
        <View style={styles.actorContainer}>
          <View style={styles.actorRow}>
            <View style={styles.actorWrapper}>
              <Image style={styles.imageAc} source={{ uri: item.Ac01_pic }} />
              <Text style={styles.actorName}>{item.Actor01}</Text>
            </View>
            <View style={styles.actorWrapper}>
              <Image style={styles.imageAc} source={{ uri: item.Ac02_pic }} />
              <Text style={styles.actorName}>{item.Actor02}</Text>
            </View>
            <View style={styles.actorWrapper}>
              <Image style={styles.imageAc} source={{ uri: item.Ac03_pic }} />
              <Text style={styles.actorName}>{item.Actor03}</Text>
            </View>
            <View style={styles.actorWrapper}>
              <Image style={styles.imageAc} source={{ uri: item.Ac04_pic }} />
              <Text style={styles.actorName}>{item.Actor04}</Text>
            </View>
            {/* You can add more actor images and names here if needed */}
          </View>
        </View>
      </View>

      {/* Movie Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.movie_name}</Text>
        <Text style={styles.description}>{item.movie_des}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  contentContainer: {
    flexDirection: 'row', // Align movie image and actors horizontally
    marginBottom: 1,
  },
  imageContainer: {
    flex: 1, // Allow the movie image to take available space
    alignItems: 'center', // Center the image horizontally
  },
  image: {
    width: 150, // Set desired width
    height: 300, // Set desired height
    borderRadius: 10,
  },
  actorContainer: {
    flex: 1,
    flexDirection: 'column', // Arrange actors vertically
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
  },
  actorRow: {
    flexDirection: 'row', // Arrange actors in a row
    flexWrap: 'wrap', // Allow wrapping to new lines
    justifyContent: 'space-around', // Space out actors evenly
    width: '100%', // Full width for the row
  },
  actorWrapper: {
    alignItems: 'center', // Center actor images and names
    margin: 10, // Increased margin for spacing between actor items
    width: '30%', // Set width to allow 3 items in a row
  },
  imageAc: {
    width:  60, // Set desired width for actor images
    height: 100, // Set desired height for actor images
    borderRadius: 10,
  },
  actorName: {
    fontSize: 14,
    textAlign: 'center', // Center the actor names
    marginTop: 8, // Space between image and name
  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: 16,
    marginBottom: 100,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
});
