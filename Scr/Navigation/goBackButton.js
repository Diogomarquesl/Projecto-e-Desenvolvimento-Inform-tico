import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReturnButton = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/de-volta.png?alt=media&token=0dae33eb-a8b4-4b66-b6d1-a086ffd8d7f6' }} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 30,
        left: 25,
        height: 30,
        width: 30,
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default ReturnButton;
