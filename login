import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';


export class LogInScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
        
              <StatusBar style="auto" />
              <LinearGradient colors={['#F6F1F8', '#A437DB']} style={styles.gradient}></LinearGradient>
        
              <View style={styles.contentContainer}>
                <Image style={styles.logo} source={require('./assets/logo.png')} />
                <Text>NightOutNow</Text>
                <TextInput placeholder='Nome' style={styles.textInput} />
                <TextInput placeholder='Email' style={styles.textInput} />
                <Button title="Login" onPress={() => {console.log("Botão pressionado");
}} variant="v1"  />
                <SecondaryButton title="Registar"onPress={() => {console.log("Botão pressionado");
}} variant="v1" />
              </View>
        
        
        
            </View>
          );
    }
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
      borderColor: 'blue',
      borderWidth: 2,
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
      borderWidth:1,
  
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
