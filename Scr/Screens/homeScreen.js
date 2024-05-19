import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {

    const onPressFunction = (item) => {
        navigation.navigate('DiscoListScreen', item);
    }

    return (


        <View style={styles.mainContainer}>
       
            <View style={styles.container}>
           
                <StatusBar style="light" />

                <Image style={styles.header} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/homeImg.jpg?alt=media&token=57c2c6a7-0edf-4fa5-b433-3e16472671b4' }} />



                <View style={styles.contentContainer}>
                    <TouchableOpacity onPress={() => onPressFunction("porto")} style={[styles.pressable, styles.pressableTop]}>
                        <Image
                            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/Porto.jpg?alt=media&token=f3ad7b19-980f-427d-9414-ec23c946c401' }}
                            style={[styles.backgroundImage, styles.backgroundImageTop]}
                        />
                        <Text style={styles.cidades}>Porto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressFunction("coimbra")} style={styles.pressable}>
                        <Image
                            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/coimbraNoite.jpg?alt=media&token=12516152-9a4d-4765-9695-4556674650fe' }}
                            style={styles.backgroundImage}
                        />
                        <Text style={styles.cidades}>Coimbra</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressFunction("lisboa")} style={styles.pressable}>
                        <Image
                            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/Lisboa.jpg?alt=media&token=f80f4426-5fe3-4c07-9994-cfaf3379fe9a' }}
                            style={styles.backgroundImage}
                        />
                        <Text style={styles.cidades}>Lisboa</Text>
                    </TouchableOpacity>

                </View>
            </View>
         
        </View>

    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    container: {
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',

    },
    contentContainer: {
        height: "65%",
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: -1,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: '#F9F9F9',
    },
    header: {
        position: 'absolute',
        width: '100%',
        height: 330,
        top: 0,

    },
    pressable: {
        height: "30%",
        width: '100%',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
    backgroundImageTop: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    cidades: {
        fontSize: 30,
        color: '#FFFFFF'
    }
});
