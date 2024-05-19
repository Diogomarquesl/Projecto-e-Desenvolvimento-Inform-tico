import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Image, Modal, View, SafeAreaView } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { useUser } from '../Navigation/UserContext';

import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { StackActions } from '@react-navigation/native';
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';






export default function LogInScreen({navigate, route}) {


  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setUser } = useUser();



  const handleLogIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      setUser(userCredential.user);
      navigation.navigate('Home', { screen: 'HomeScreen' });
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  };




  return (

    <View style={styles.container}>

      <StatusBar style="auto" />

      <LinearGradient
        colors={['#F6F1F8', '#A437DB']}
        style={styles.gradient}>

      </LinearGradient>

      <View style={styles.contentContainer}>

        <Image
          style={styles.logo}
          source={{uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/logo.png?alt=media&token=ce41920e-2769-409b-ae57-d70fc90fdb45'}}
        />

        <Text style={{marginBottom:20}}>NightOutNow</Text>

        <TextInput
          style={styles.textInput}
          placeholder='Email'
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />


        <Button
          title="Login"
          onPress={() =>handleLogIn()}
          
        />

        <SecondaryButton
          title="Registar"
          variant="v1"
          onPress={() => navigation.navigate('SignUpScreen')}
        />

      </View>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },

  contentContainer: {
    width: '60%',
    height: '80%',
    alignItems: 'center',

  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,

  },

  textInput: {
    width: '100%',
    height: 40,
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,

  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,

  },
  botao: {
    borderWidth: 20,
    borderRadius: 20,
  },
});
