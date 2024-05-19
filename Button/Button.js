import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { buttonOutline, buttonPrimary, variants } from "./variants";








export function Button({
    title,
    onPress,
    variant = "primary",
}) {
    const buttonVariant = variants[variant];
    const buttonStyle = buttonPrimary.enabled;
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: buttonStyle.button.backgroundColor }]}>
            <Text style={[styles.title, { color: buttonStyle.tittle.color }]}>{title}</Text>
        </TouchableOpacity>
    );
}


export function SecondaryButton({ title, onPress, variant }) {
    return (
        <TouchableOpacity style={styles[variant]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}
export function SmallButton({ title, onPress, variant }) {
    return (
        <TouchableOpacity style={styles[variant]} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '80%',
        padding: 10,
        backgroundColor: '#5400A8',
        borderRadius: 20,
        elevation: 5,
        alignItems: 'center',
        marginTop: 10,

    },
    v1: {

        width: '80%',
        padding: 3,
        backgroundColor: 'transparent',
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    v2: {
        backgroundColor: 'blue',
    },
    title: {
        color: 'white'
    },
    v3: {
        padding: 2,
        backgroundColor: '#5400A8',
        height: 25,
        width: 100,
        borderRadius: 20,
        textAlign:'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
position:'absolute',
marginRight:20,

    }
});