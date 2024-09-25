import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', name: 'Action', subcollection: 'Action', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '2', name: 'Comedy', subcollection: 'Comedy', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '3', name: 'Drama', subcollection: 'Drama', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '4', name: 'Horror', subcollection: 'Horror', documentId: '9uyaTCxojw03bRPJAOFi' },
  { id: '5', name: 'Romance', subcollection: 'Romance', documentId: '9uyaTCxojw03bRPJAOFi' },
  // เพิ่มหมวดหมู่อื่น ๆ ตามที่ต้องการ
];

export default function Category({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate('CategoryDetails', { 
        subcollection: item.subcollection, 
        documentId: item.documentId,
        category: item.name 
      })}
    >
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
