

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



export function FiltroPreco({ordenarPorPreco}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [precoFiltro, setPrecoFiltro] = useState(null);

    return (
        <View style={{marginTop:7 }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: precoFiltro ? '#D284F6' : '#d3d3d3' }]} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Preço</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Preço</Text>
                        <TouchableOpacity style={styles.option} onPress={() => {ordenarPorPreco('ascendente'),setPrecoFiltro('ascendente'); setModalVisible(false); }}>
                            {precoFiltro === 'ascendente' && <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />}
                            {precoFiltro !== 'ascendente' && <Ionicons name="radio-button-off" size={24} color="#aaa" />}
                            <Text style={styles.optionText}>Ordenar Ascendente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => {ordenarPorPreco('descendente'),setPrecoFiltro('descendente'); setModalVisible(false);}}>
                            {precoFiltro === 'descendente' && <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />}
                            {precoFiltro !== 'descendente' && <Ionicons name="radio-button-off" size={24} color="#aaa" />}
                            <Text style={styles.optionText}>Ordenar Descendente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => { setPrecoFiltro(null); setModalVisible(false); }}>
                            {precoFiltro === null && <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />}
                            {precoFiltro !== null && <Ionicons name="radio-button-off" size={24} color="#aaa" />}
                            <Text style={styles.optionText}>Nenhum</Text>
                        </TouchableOpacity>
                        <Button title="Fechar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
        alignSelf:'center'

    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        alignSelf:'flex-start'
    },
    optionText: {
        marginLeft: 10,
    },
});