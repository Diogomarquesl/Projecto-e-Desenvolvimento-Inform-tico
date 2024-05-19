import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, SecondaryButton } from '../../Button/Button';
export function FiltroClassificacao({ ordenarPorClassificacao }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [classificacaoFiltro, setClassificacaoFiltro] = useState(null);

    return (
        <View style={{marginTop: 7 }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: classificacaoFiltro !== null ? '#D284F6' : '#d3d3d3' }]} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Classificação</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Classificação</Text>
                        <TouchableOpacity style={styles.option} onPress={() => { ordenarPorClassificacao('ascendente'), setClassificacaoFiltro('ascendente'); setModalVisible(false); }}>
                            {classificacaoFiltro === 'ascendente' && <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />}
                            {classificacaoFiltro !== 'ascendente' && <Ionicons name="radio-button-off" size={24} color="#aaa" />}
                            <Text style={styles.optionText}>Ascendente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => { ordenarPorClassificacao('descendente'), setClassificacaoFiltro('descendente'); setModalVisible(false); }}>
                            {classificacaoFiltro === 'descendente' && <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />}
                            {classificacaoFiltro !== 'descendente' && <Ionicons name="radio-button-off" size={24} color="#aaa" />}
                            <Text style={styles.optionText}>Descendente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => { ordenarPorClassificacao(null); setClassificacaoFiltro(null); setModalVisible(false); }}>
                            {classificacaoFiltro === null && <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />}
                            {classificacaoFiltro !== null && <Ionicons name="radio-button-off" size={24} color="#aaa" />}
                            <Text style={styles.optionText}>Nenhuma</Text>
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
        width: 110,
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
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        alignSelf: 'flex-start',
    },
    optionText: {
        marginLeft: 10,
    },
   
});
