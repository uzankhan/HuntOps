import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';

type LoginScreenProps = { navigation: NavigationProp<any> };

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('uzankhan17@gmail.com');
  const [password, setPassword] = useState('Cristiano_7');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        navigation.navigate('Dashboard');
      } else Alert.alert('Login Failed', data.message);
    } catch (error: any) { Alert.alert('Error', error.message); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎯 HUNTOPS</Text>
        <Text style={styles.subtitle}>Developed by Uzan Khan</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A0A0A' },
  card: { width: '90%', maxWidth: 400, backgroundColor: '#2D0A0A', padding: 30, borderRadius: 20, borderWidth: 2, borderColor: '#D4AF37' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#D4AF37', textAlign: 'center', marginBottom: 5 },
  subtitle: { color: '#C0C0C0', textAlign: 'center', marginBottom: 30, fontSize: 14 },
  input: { backgroundColor: '#1A0A0A', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#D4AF37' },
  button: { backgroundColor: '#D4AF37', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});