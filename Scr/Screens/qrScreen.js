import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import { getDocs, collection, query, where, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function QRScreen() {
    const [disco, setDisco] = useState([]);
    const DiscoCollectionRef = collection(db, "discotecas");
    const route = useRoute();
    const { purchaseData } = route.params;
console.log(purchaseData)

    useEffect(() => {
        const getDisco = async () => {
            try {
                const querySnapshot = await getDocs(query(DiscoCollectionRef, where("nome_discoteca", "==", purchaseData.nome_discoteca)));
                const disco = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDisco(disco);

            } catch (err) {
                console.error(err);
            }
        };
        getDisco();
    }, [purchaseData.nome_discoteca]);
    const generateQRCode = (purchaseData) => {
        const qrData = JSON.stringify(purchaseData);
        return <QRCode value={qrData} size={200} />;
    };

    const renderPurchaseDetails = () => {
        if (purchaseData.bilhete_normal !== undefined) {
            return (
                <View style={styles.description}>
                    <Text>Valor: {purchaseData.valor.toFixed(2)}$</Text>
                    <Text>x{purchaseData.bilhete_normal} Normal</Text>
                    <Text>x{purchaseData.bilhete_vip} VIP</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.description}>
                    <Text>Valor: {purchaseData.valor.toFixed(2)}$</Text>
                    <Text>x{purchaseData.finos} Fino</Text>
                    <Text>x{purchaseData.shot}Shot</Text>
                    <Text>x{purchaseData.bebidaBranca}Bebida Branca</Text>
                    
                </View>
            );
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

            <View style={styles.contentContainer}>
                <View style={styles.backgroundContainer}>
                    {disco.length > 0 ? (
                        <Image style={styles.logo} source={{ uri: disco[0].img_Logo }} />
                    ) : (
                        <Text>Carregando...</Text>
                    )}

                    <Text style={styles.title}>Apresente o QR Code no balcão</Text>
                    <View style={styles.qrContainer}>
                        {generateQRCode(purchaseData)}
                    </View>
                    <View>
                        {renderPurchaseDetails()}
                    </View>

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
        height: '80%',
        position: 'absolute',
        bottom: 0,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: '#F9F9F9',
        alignItems: 'center'
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    logo: {
        height: '30%',
        aspectRatio: 1,
        borderWidth: 3,
        borderColor: '#ffffff',
        borderRadius: 20,
        alignSelf: 'center',
        top: '-15%',
        marginLeft: '11%',
        position: 'absolute',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        marginTop: 100
    },
    qrContainer: {
        alignSelf: 'center'

    },
    description:{
        flexDirection: 'row',
        flexWrap: 'wrap',   
        justifyContent: 'space-between', 
        paddingHorizontal: 10,
        marginTop: 10,
        
        fontWeight:'500',
    }


});
