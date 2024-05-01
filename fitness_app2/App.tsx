import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import MainMenu from './components/mainMenu';

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Track whether user is on login or sign-up screen

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleAuthAction = async () => {
    try {
      if (isLogin) {
        // Handle login
        await auth().signInWithEmailAndPassword(email, password);
        console.log('Login successful!');
      } else {
        // Handle sign-up
        await auth().createUserWithEmailAndPassword(email, password);
        console.log('Sign-up successful!');
      }
    } catch (error) {
      console.error('Authentication error:', 'Error logging in or signing up.');
    }
  };

  if (user) {
    return <MainMenu navigation={undefined} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button 
        title={isLogin ? 'Login' : 'Sign Up'} 
        onPress={handleAuthAction} 
        
      />
      <Text
        style={styles.switchText}
        onPress={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: '80%',
  },
  switchText: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default App;