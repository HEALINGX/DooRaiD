import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Configs/Firebase';

export default function Profile() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('CurrentUsername'); // Replace with actual current username
  const [editable, setEditable] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Movie"));
      const docsData = querySnapshot.docs.map(doc => doc.data());
      setData(docsData);
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditable(!editable);
    if (editable) {
      setUsername(newUsername); // Save the new username
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => {
            // Handle log out here
            // For example, clear auth tokens and navigate to login screen
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={editable ? newUsername : username}
        onChangeText={setNewUsername}
        editable={editable}
      />
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>{editable ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#16247d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
