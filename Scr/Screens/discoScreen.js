import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { db } from '../../config/firebase';
import { getDocs, doc, collection, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { Button, SecondaryButton, SmallButton } from '../../Button/Button';
import { WebView } from 'react-native-webview';
import MapView, { Marker } from 'react-native-maps';
import ReturnButton from '../Navigation/goBackButton';
import { Ionicons } from '@expo/vector-icons';

export default function DiscoScreen({ navigation, route }) {

    const [disco, setDisco] = useState([]);
    const DiscoCollectionRef = collection(db, "discotecas");


    useEffect(() => {
        const getDisco = async () => {
            try {
                const querySnapshot = await getDocs(query(DiscoCollectionRef, where("nome_discoteca", "==", route.params)));
                const disco = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log("Discoteca Recebida:", disco);


                setDisco(disco);
            } catch (err) {
                console.error(err);
            }
        };

        getDisco();
    }, [route.params]);

    const ticketline = (item) => {
        navigation.navigate('TicketScreen', item);
    }
    const camara = () => {
        navigation.navigate('');
    }
    const ConverterEmEuro = () => {
        const avaliacao = '€'.repeat(disco[0].preco);
        console.log(avaliacao);
        return avaliacao;
    }


    return (


        <View style={styles.mainContainer}>

            <View style={styles.container}>

                <StatusBar style="auto" />

                {disco.length > 0 && (
                    <Image style={styles.header} source={{ uri: disco[0].img_espaco }} />
                )}


            </View>


            <View style={styles.contentContainer}>
                {disco.length > 0 && (
                    <>
                        <ReturnButton />
                        <Image style={styles.logo} source={{ uri: disco[0].img_Logo }} />
                        <View style={{ height: '90%', justifyContent: 'flex-end', marginTop: 60 }}>
                            <ScrollView >
                                <View style={{
                                    marginTop: '5%', paddingLeft: 15, width: '95%', alignSelf: 'center'
                                }}>
                                    <Text style={{ fontSize: 24 }}>{disco[0].nome_discoteca}</Text>
                                    <Text style={{ fontSize: 12 }}>{disco[0].localizacao}</Text>
                                    <SmallButton title="Direções" variant='v3' onPress={() => navigation} />
                                </View>

                                <View style={styles.optionsContainer}>
                                    
                                    <TouchableOpacity onPress={() => onPressFunction()} style={styles.options}>

                                    <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/icon_carrinhoCompras.png?alt=media&token=4736be95-d8df-49c4-9306-7351bf0a5172' }} />
                                    
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => camara()} style={styles.options}>

                                    <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/icon_camera.png?alt=media&token=f8fd5df4-ef55-4b52-8649-d6a8064bff73' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => ticketline(disco[0].nome_discoteca)} style={styles.options}>
                                        <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/ticketIcon.png?alt=media&token=d5038a13-0722-46de-b854-990dd99c08d1' }} />

                                    </TouchableOpacity>
                                </View>



                                <View style={{ marginTop: 35 }}>
                                    <Text style={{ fontSize: 20, marginLeft: 25, fontWeight: 700 }}>
                                        Avaliações</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-around' }}>
                                    <View>
                                        <View style={styles.molduraAvaliacao}>
                                            <Image style={styles.avaliacao} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/iconEuro.jpg?alt=media&token=9c6833dd-118b-47cb-bca6-0914ab69dd92' }} />
                                        </View>
                                        <Text style={{ alignSelf: 'center', fontWeight: 900, marginTop: 10 }}>{ConverterEmEuro()}</Text>

                                    </View>
                                    <View>
                                        <View style={styles.molduraAvaliacao}>
                                            <Image style={styles.avaliacao} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/iconAvaliacao.png?alt=media&token=cb38d0ad-2067-4cd2-96e3-87edea570b92' }} />
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                            <Text style={{ fontWeight: 900 }}>{disco[0].avaliacao} / 5 </Text>
                                            <Ionicons name="star" size={16} color="#FFD700" />
                                        </View>
                                    </View>
                                    
                                </View>


                                <View style={{ marginTop: 35 }}>
                                    <Text style={{ fontSize: 20, marginLeft: 25, fontWeight: 700 }}>Localização</Text>
                                </View>
                                <View style={styles.map}>

                                    <MapView
                                        style={{ width: '100%', height: '100%' }}
                                        initialRegion={{
                                            latitude: disco[0].latitude,
                                            longitude: disco[0].longitude,
                                            latitudeDelta: 0.0022,
                                            longitudeDelta: 0.06421,
                                        }}
                                        zoomEnabled={true}
                                        scrollEnabled={false}
                                    >
                                        <Marker
                                            coordinate={{
                                                latitude: disco[0].latitude,
                                                longitude: disco[0].longitude,
                                            }}
                                            title={disco[0].nome_discoteca}

                                        />
                                    </MapView>
                                </View>


                                <View style={{ marginTop: 35 }}>
                                    <Text style={{ fontSize: 20, marginLeft: 25, fontWeight: 700 }}>Lotação</Text>
                                </View>
                                <View style={styles.lotacao}>
                                    <View style={styles.infoLot}>
                                        <Text style={{ fontSize: 38, fontWeight: 500}}>{disco[0].capacidade} </Text>
                                        <Ionicons name="people-outline" size={36}/>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </>
                )}

            </View>



        </View>

    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: '#F9F9F9'
    },
    container: {
        height: "30%",
        alignItems: 'center',
        justifyContent: 'center',

    },
    contentContainer: {
        height: "75%",
        width: '100%',
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        position: 'absolute',
        backgroundColor: '#F9F9F9',
        bottom: 0,


    },
    header: {
        width: '100%',
        height: '100%',
        top: 0,
        alignSelf: 'center',
        marginBottom: 10

    },
    logo: {
        height: 120,
        aspectRatio: 1,
        borderWidth: 3,
        borderColor: '#ffffff',
        borderRadius: 20,
        alignSelf: 'flex-start',
        top: -60,
        marginLeft: 70,
        position: 'absolute',
    },
    optionsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-around'
    },


    options: {
        width: 80,
        height: 80,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10
    },
    icons: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    molduraAvaliacao: {
        borderWidth: 4,
        borderColor: '#CE8AEE',
        width: 70,
        aspectRatio: 1,
        justifyContent: 'center',
        borderRadius: 50,
        
    },
    avaliacao: {
        width: 50,
        aspectRatio: 1,
        borderColor: 'white',
        borderRadius: 50,
        alignSelf: 'center'
    },
    map: {
        height: 300,
        marginTop: 10
    },
    lotacao: {
        width: '70%',
        aspectRatio: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 360,
        backgroundColor: '#D9D9D9',
        marginBottom: 30,
        
    },
    infoLot: {
        borderWidth: 3,
        borderColor: '#D284F6',
        borderRadius: 360,
        width: '70%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        flexDirection:'row'
    }
});
