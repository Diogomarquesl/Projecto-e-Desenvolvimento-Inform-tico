

import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, SafeAreaView, Modal } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { db } from '../../config/firebase';
import { getDocs, doc, collection, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp, firebase } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

import { useNavigation } from '@react-navigation/native';



export function TotalCompras({ ordenarPorPreco }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [precoFiltro, setPrecoFiltro] = useState(null);

    return (
        <View style={{ marginTop: 7 }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: precoFiltro ? '#D284F6' : '#d3d3d3' }]} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Preço</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Resumo do Pedido</Text>
                        <Text style={styles.modalItem}>Fino: {quantities.fino}</Text>
                        <Text style={styles.modalItem}>Shot: {quantities.shot}</Text>
                        <Text style={styles.modalItem}>Bebida Branca: {quantities.v}</Text>
                        <Text style={styles.modalTotal}>Preço Total: {totalPrice.toFixed(2)}€</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,

    },
    buttonText: {
        color: 'black',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        alignSelf: 'center'

    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        alignSelf: 'flex-start'
    },
    optionText: {
        marginLeft: 10,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalItem: {
        fontSize: 16,
        marginVertical: 5,
    },
    modalTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});