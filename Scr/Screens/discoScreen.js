import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect,useCallback } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Modal, SafeAreaView } from 'react-native';
import { db } from '../../config/firebase';
import { getDocs, doc, collection, updateDoc, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { Button, SecondaryButton, SmallButton } from '../../Button/Button';
import { WebView } from 'react-native-webview';
import MapView, { Marker } from 'react-native-maps';
import ReturnButton from '../Navigation/goBackButton';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useUser } from '../Navigation/UserContext';
import { useFocusEffect } from '@react-navigation/native';


export default function DiscoScreen({ navigation, route }) {

    const [disco, setDisco] = useState([]);
    const DiscoCollectionRef = collection(db, "discotecas");
    const [pointsModalVisible, setPointsModalVisible] = useState(false);
    const [points, setPoints] = useState('');
    const { user } = useUser();
    const [lastPointsTime, setLastPointsTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [pulseiras, setPulseiras] = useState([]);
    const [dateModalVisible, setDateModalVisible] = useState(false);

    const getDisco = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(query(DiscoCollectionRef, where("nome_discoteca", "==", route.params)));
            const disco = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log("Discoteca Recebida:", disco);
            setDisco(disco);
            if (disco.length > 0) {
                const discoId = disco[0].id;
                const TicketCollectionRef = collection(db, `discotecas/${discoId}/bilhetes`);

                const pulseirasSnapshot = await getDocs(TicketCollectionRef);
                const pulseiras = pulseirasSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.data_evento.toDate().toLocaleString('pt', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })
                    };
                });

                console.log("Pulseiras Recebidas:", pulseiras);
                setPulseiras(pulseiras);
            }
        } catch (err) {
            console.error(err);
        }
    }, [route.params]);

    useEffect(() => {
        getDisco();
    }, [getDisco]);
    useFocusEffect(
        useCallback(() => {
            getDisco();
        }, [getDisco])
    );

    const ticketline = (item) => {
        navigation.navigate('TicketScreen', item);
    }

    const shop = (item) => {
        navigation.navigate('ShopScreen', item);
    }
    const ConverterEmEuro = () => {
        const avaliacao = '€'.repeat(disco[0].preco);
        console.log(avaliacao);
        return avaliacao;
    }
    const openGoogleMaps = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };
    const addPoints = async () => {
        const now = new Date();
        if (lastPointsTime && (now - lastPointsTime) < 3600000) {
            alert('Só é possível ganhar pontos uma vez por hora.');
            return;
        }

        try {
            const userDocRef = doc(db, "utilizadores", user.uid);
            await updateDoc(userDocRef, {
                pontos: points + 5
            });
            setLastPointsTime(now);
            setPointsModalVisible(false);
            alert("Parabéns ganhou 5 pontos pode troca-los na sua Conta");
        } catch (err) {
            console.error("Erro ao adicionar pontos: ", err);
        }
    };
    
   

    const [percentageOccupied, setPercentageOccupied] = useState(0);
    const [filteredPulseiras, setFilteredPulseiras] = useState([]);
    useEffect(() => {
        if (selectedDate) {
            const filtered = pulseiras.filter(pulseira => pulseira.date === selectedDate);
            setFilteredPulseiras(filtered);
            const totalSold = filtered.reduce((sum, pulseira) =>disco[0].capacidade -( sum + pulseira.lotacao), 0);
            console.log(totalSold)
            const capacity = disco.length > 0 ? disco[0].capacidade : 0;
            setPercentageOccupied(capacity > 0 ? (totalSold / capacity) * 100 : 0);
        }
    }, [selectedDate, pulseiras]);
    useFocusEffect(
        useCallback(() => {
           
           
           
        }, [])
    );

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
                        <ReturnButton accessible={true} accessibilityRole="button" accessibilityLabel="Voltar à ultima página" />
                        <Image style={styles.logo} source={{ uri: disco[0].img_Logo }} accessible={true} accessibilityRole="image" accessibilityLabel='Logotipo bar/discoteca' />
                        <View style={{ height: '90%', justifyContent: 'flex-end', marginTop: 60 }}>
                            <ScrollView >
                                <View style={{
                                    marginTop: '5%', paddingLeft: 15, width: '95%', alignSelf: 'center'
                                }}>
                                    <Text style={{ fontSize: 24 }}>{disco[0].nome_discoteca}</Text>
                                    <Text style={{ fontSize: 12 }}>{disco[0].localizacao}</Text>
                                    <SmallButton title="Direções" variant='v3' onPress={() => openGoogleMaps(disco[0].latitude, disco[0].longitude)} accessible={true} accessibilityRole="button" accessibilityLabel="Redireciona para o Google maps com a localização da discoteca/bar" />
                                </View>

                                <View style={styles.optionsContainer}>

                                    <TouchableOpacity onPress={() => shop(disco[0].nome_discoteca, disco[0].img_Logo)} style={styles.options} accessible={true} accessibilityRole="imagebutton" accessibilityLabel='Redireciona para a loja da discoteca/bar'>
                                        <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/icon_carrinhoCompras.png?alt=media&token=4736be95-d8df-49c4-9306-7351bf0a5172' }} />

                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => ticketline(disco[0].nome_discoteca)} style={styles.options} accessible={true} accessibilityRole="imagebutton" accessibilityLabel='Redireciona para a bilheteira da discoteca/bar'>
                                        <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/ticketIcon.png?alt=media&token=d5038a13-0722-46de-b854-990dd99c08d1' }} />

                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { setPointsModalVisible(true) }} style={styles.options} accessible={true} accessibilityRole="imagebutton" accessibilityLabel='Abre o sistema de pontos'>

                                        <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/points.png?alt=media&token=f93dc0dc-544d-45fe-a438-a51296aad3a8' }} />
                                    </TouchableOpacity>

                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={pointsModalVisible}
                                        onRequestClose={() => setPointsModalVisible(false)}
                                    >
                                        <View style={styles.modalOverlay}>
                                            <View style={styles.modalContainer}>
                                                <TouchableOpacity onPress={() => setPointsModalVisible(false)} style={styles.closeButton} accessible={true} accessibilityRole="button" accessibilityLabel='Fecha a aba do sistema de pontos'>
                                                    <Text style={styles.closeButtonText}>X</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.modalTitle}>Pontos</Text>

                                                <Button onPress={addPoints} title='Ganhar pontos' accessible={true} accessibilityRole="button" accessibilityLabel='Botao de ganhar pontos'>
                                                </Button>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>



                                <View style={{ marginTop: 35 }}>
                                    <Text style={{ fontSize: 20, marginLeft: 25, fontWeight: 700 }}>
                                        Avaliações</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-around' }}>
                                    <View>
                                        <View style={styles.molduraAvaliacao}>
                                            <Image style={styles.avaliacao} accessible={true} accessibilityRole="image" accessibilityLabel='Mostra faixa de preços da discoteca/bar' source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/iconEuro.jpg?alt=media&token=9c6833dd-118b-47cb-bca6-0914ab69dd92' }} />
                                        </View>
                                        <Text style={{ alignSelf: 'center', fontWeight: 900, marginTop: 10 }}>{ConverterEmEuro()}</Text>

                                    </View>
                                    <View>
                                        <View style={styles.molduraAvaliacao}>
                                            <Image style={styles.avaliacao} accessible={true} accessibilityRole="image" accessibilityLabel='Avaliação da discote/bar' source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/iconAvaliacao.png?alt=media&token=cb38d0ad-2067-4cd2-96e3-87edea570b92' }} />
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
                                        accessible={true} accessibilityRole="map" accessibilityLabel='Mapa com a localização da discoteca/bar'
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
                                    <Text style={{ fontSize: 20, marginLeft: 25, fontWeight: 700 }}>Lotação esperada</Text>
                                    <TouchableOpacity style={styles.dateSelector} onPress={() => setDateModalVisible(true)} accessible={true} accessibilityRole="list" accessibilityLabel='Abre a lista de datas para ver a percentagem de Lotação'>
                                        <Text>{selectedDate ? selectedDate : "Selecione uma Data"}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.lotacao} >
                                    <View style={styles.infoLot}>
                                        <Text style={{ fontSize: 38, fontWeight: 500 }}> {percentageOccupied.toFixed(2)}%</Text>
                                        <Ionicons name="people-outline" size={36} />
                                    </View>
                                </View>
                            </ScrollView>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={dateModalVisible}
                                onRequestClose={() => setDateModalVisible(false)}
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.modalTitle}>Selecione uma Data</Text>
                                        <ScrollView>
                                            {pulseiras.map((pulseira) => (
                                                <TouchableOpacity
                                                    key={pulseira.id}
                                                    style={styles.dateOption}
                                                    onPress={() => {
                                                        setSelectedDate(pulseira.date);
                                                        setDateModalVisible(false);
                                                    }}
                                                >
                                                    <Text style={styles.dateText}>{pulseira.date}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <Button title="Fechar" onPress={() => setDateModalVisible(false)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao de fechar a lista de datas'/>
                                    </View>
                                </View>
                            </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        height: '40%',
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#CFCFCF',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
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
        flexDirection: 'row'
    },
    dateSelector: {
        borderWidth: 1,
        borderColor: '#CFCFCF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center'
    },
    dateOption: {
        padding: 10,
        borderWidth: 1,
        marginTop: 10,
        borderColor: '#CFCFCF'
    },
    dateText: {
        fontSize: 16,
        fontWeight: '700'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    headerModal: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 10
    },
    modalContainer: {
        width: '100%',
        height: '40%',
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalItem: {
        fontSize: 16,
        marginVertical: 5,
    },
});