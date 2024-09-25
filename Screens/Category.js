import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', name: 'Action' },
  { id: '2', name: 'Comedy' },
  { id: '3', name: 'Drama' },
  { id: '4', name: 'Horror' },
  { id: '5', name: 'Romance' },
  // เพิ่มหมวดหมู่ตามที่คุณต้องการ
];

export default function Category({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('CategoryDetails', { category: item })}>
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
    borderColor: '#000'
  },
  title: {
    fontSize: 18,
  },
});
