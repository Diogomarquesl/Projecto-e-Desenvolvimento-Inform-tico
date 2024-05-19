import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';

import ReturnButton from '../Navigation/goBackButton';


const onPressFunction = () => {
    console.log("nhdfj");
}


export default function TicketScreen({ navigation, route }) {
    const [disco, setDisco] = useState([]);
    const DiscoCollectionRef = collection(db, "discotecas");
    const [pulseiras, setPulseiras] = useState([]);

    const [number, setNumber] = useState('');
    useEffect(() => {
        const getDisco = async () => {
            try {
                const querySnapshot = await getDocs(query(DiscoCollectionRef, where("nome_discoteca", "==", route.params)));
                const disco = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log("Discoteca Recebida:", disco);
                setDisco(disco);
                if (disco.length > 0) {
                    const discoId = disco[0].id;
                    const TicketCollectionRef = collection(db, `discotecas/${discoId}/tickets`);

                    const pulseirasSnapshot = await getDocs(TicketCollectionRef);
                    const pulseiras = pulseirasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    console.log("Pulseiras Recebidas:", pulseiras);
                    setPulseiras(pulseiras);
                }
            } catch (err) {
                console.error(err);
            }
        };

        getDisco();
    }, [route.params]);


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


            {disco.length > 0 && (
                <View style={styles.contentContainer}>

                    <ReturnButton />

                    <Image style={styles.logo} source={{ uri: disco[0].img_Logo }} />
                    <Text style={{ marginTop: 80, marginLeft: 30, fontSize: 26, fontWeight: '900' }}>Reservar Pulseira</Text>

                    <TouchableOpacity style={styles.tickets}>
                        <View>
                            <Text>Pulseira</Text>
                            {pulseiras.length > 0 ? (
                                <Text>{pulseiras[0].preco_normal}€</Text>
                            ) : (
                                <Text>Carregando...</Text>
                            )}



                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={number}
                            placeholder='0'
                            onChangeText={handleInputChange}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tickets}>

                    </TouchableOpacity>


                    <View style={{ position: 'absolute', bottom: 15, width: '100%', alignItems: 'center' }}>
                        <Button title="Continuar" onPress={handleInputChange} />
                    </View>


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
        height: '20%',
        width: '20%',
        borderWidth: 3,
        borderColor: '#ffffff',
        borderRadius: 20,
        alignSelf: 'center',
        top: '-10%',
        marginLeft: '11%',
        position: 'absolute',
    },
    tickets: {
        borderWidth: 3,
        borderColor: '#CFCFCF',
        height: 120,
        marginTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'

    },
    input: {
        width: 40,
        height: 40,
        backgroundColor: '#D9D9D9',
        textAlign: 'center'
    }





});