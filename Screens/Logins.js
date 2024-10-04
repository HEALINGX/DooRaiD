import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Logins = ({ navigation }) => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth.signInWithEmail(email, password);
      
      Alert.alert('Login Success', 'Welcome back!');
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.registerText}>
        Don't have an account?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Register here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
  },
  registerLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default Logins;
