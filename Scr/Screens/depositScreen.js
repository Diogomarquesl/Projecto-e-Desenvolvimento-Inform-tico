import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { Filtro1 } from '../Navigation/filtroPreco';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { Pressable } from 'react-native';






export default function DepositScreen() {
    const [value, setValue] = useState();

    return (
        <View style={styles.container}>

            <StatusBar style="light" />
            <LinearGradient
                colors={['#210042', '#5400A8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}>

            </LinearGradient>




            <View style={styles.contentContainer}>
                <View style={styles.backgroundContainer}>
                    <Text style={styles.title}>Depositar</Text>
                    <Text>Insira o montante que deseja depositar</Text>
                    <TextInput
                        style={styles.input}
                        value={value}
                        placeholder="$"
                        keyboardType="numeric"
                    />
                    <Text style={styles.title}>Descrição</Text>
                    <Text>(Opcional)</Text>
                    <TextInput
                        style={styles.inputDescricao}
                        value={value}

                    />
                    <Button
                        title="Continuar"
                        onPress={Button}
                    />
                </View>

            </View>



        </View>
    );

}



const styles = StyleSheet.create({
    container: {
        flex: 1,        
        justifyContent: 'flex-end',
    },

    contentContainer: {
        width: '100%',
        height: '70%',
        position: 'absolute',
        alignSelf:'f',
        backgroundColor: '#F9F9F9',
       alignSelf:'baseline'

    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    headerText: {
        fontSize: 20,
        color: '#FFFFFF',
        top: 50,

    },

    backgroundContainer: {
        width: '80%',
        height: 500,
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        top: -90,
        borderRadius: 15,
        elevation: 6,
        alignItems: 'center'



    },
    title:{
        fontSize:20,
        fontWeight:'800',
        marginTop:15,
    },
    input: {
        borderWidth: 3,
        borderColor: '#00FFFF',
        width: '78%',
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        paddingStart: 15,
        marginTop:15,
    },
    inputDescricao: {
        borderWidth: 3,
        borderColor: '#00FFFF',
        width: '78%',
        height: '30%',
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        paddingStart: 15,
        marginTop:10,
    }


});