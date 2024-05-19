import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import ReturnButton from '../Navigation/goBackButton';
import { useUser } from '../Navigation/UserContext';
import RefreshButton from '../Navigation/RefreshButton';
import Icon from 'react-native-vector-icons/FontAwesome';
const onPressFunction = () => {
    console.log("nhdfj");
}


export default function AccountScreen({ navigation, route }) {
    const [userInfo, setUser] = useState([]);
    const { user } = useUser();
    const UserCollectionRef = collection(db, "utilizadores");


    const [number, setNumber] = useState('');
    useEffect(() => {
        const getUser = async () => {
            if (user?.uid) {
                try {
                    const querySnapshot = await getDocs(query(UserCollectionRef, where("id_Utilizador", "==", user?.uid)));
                    const userInfo = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    console.log("Utilizador Recebido:", userInfo);
                    setUser(userInfo);

                } catch (err) {
                    console.error(err);
                }
            }
        };

        getUser();
    }, []);


    const handleInputChange = (text) => {

        if (/^\d*$/.test(text)) {
            setNumber(text);
        }
    };


    return (
        <View style={styles.container}>

            <StatusBar style="light" />
            <LinearGradient
                colors={['#210042', '#5400A8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}>
            </LinearGradient>


            {userInfo.length > 0 && (
                <View style={styles.contentContainer}>

                    <ReturnButton />



                    <Image style={styles.logo} source={{ uri: userInfo[0].img_User }} />

                    <Text style={styles.userName}> {user?.email}</Text>

                    <TouchableOpacity style={{ ...styles.options, marginTop: 20 }}>
                        <Icon name="user" size={30} color="#000" />
                        <Text style={styles.title}>Dados Pessoais</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Icon name="ticket" size={30} color="#000" />
                        <Text style={styles.title}>Bilhetes</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Icon name="shopping-cart" size={30} color="#000" />
                        <Text style={styles.title}>Compras</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Icon name="trophy" size={30} color="#000" />
                        <Text style={styles.title}>Pontos</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tickets}>

                    </TouchableOpacity>





                </View>


            )}
        </View>
    );

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9F9F9'

    },

    contentContainer: {
        width: '100%',
        height: '80%',
        position: 'absolute',
        bottom: 0,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: '#F9F9F9',

    },
    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',


    },
    logo: {
        height: 140,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 360,
        alignSelf: 'center',
        top: -70,
        position: 'absolute',
    },
    userName: {
        marginTop: 80,
        fontSize: 26,
        fontWeight: '900',
        alignSelf: 'center'
    },
    options: {
        borderWidth: 1,
        borderColor: '#CFCFCF',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',

    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginLeft:15
    }



});