import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen({ navigate }) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (data) => {
        setLoading(true);
        setError('');

        try {
            const q = query(collection(db, "utilizadores"), where("email", "==", data.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Já existe um utilizador com este email.');
                setLoading(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password,data.username);
            console.log('User signed up successfully');
            console.log(auth);

            const uid = userCredential.user.uid;
            const docUser = doc(db, "utilizadores", uid);

            await setDoc(docUser, {
                'id_Utilizador': uid,
                'saldo': 0,
                'userName': data.username,
                'img_User': 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/default_User_Img.png?alt=media&token=f248527f-6ef5-4e94-a940-e1a00a0d92f5',
                'email': data.email ,
                'pontos':10
            });

            navigation.navigate('LogInScreen', { screen: 'LogInScreen' });
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('Já existe um utilizador com este email.');
            } else {
                console.error('Signup failed:', error.message);
                setError('Falha no registo. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const schema = yup.object({
        email: yup.string().email("Email Invalido").required("Preencha o email"),
        password: yup.string().min(6, "A password deve ter pelos menos 6 digitos").required("Introduza uma password")
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <LinearGradient colors={['#F6F1F8', '#A437DB']} style={styles.gradient} />
            <View style={styles.contentContainer}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
                <Text style={{fontSize:18, fontWeight:'400'}}>NightOutNow </Text>


                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.textInput, {
                                borderWidth:0,                                
                                marginTop: 20
                            }]}
                            placeholder='Nome'
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.textInput, {
                                borderWidth: errors.email && 1,
                                borderColor: errors.email && '#ff375b',
                               
                            }]}
                            placeholder='Email'
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.email && <Text style={styles.labelError}>{errors.email?.message}</Text>}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.textInput, {
                                borderWidth: errors.password && 1,
                                borderColor: errors.password && '#ff375b'
                            }]}
                            placeholder='Password'
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={true}
                        />
                    )}
                />
                {errors.password && <Text style={styles.labelError}>{errors.password?.message}</Text>}
                {error && <Text style={styles.labelError}>{error}</Text>}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Registar" onPress={handleSubmit(handleSignup)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para registar' />
                )}
                <SecondaryButton
                    title="Já tem conta?"
                    variant="v1"
                    onPress={() => navigation.navigate('LogInScreen')}
                    accessible={true} accessibilityRole="button" accessibilityLabel='Botao para ir para a tela de login'
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        width: '60%',
        height: '80%',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    textInput: {
        width: '100%',
        height: 40,
        borderRadius: 15,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderColor: 'black',
        borderWidth: 1,
    },
    gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    botao: {
        borderWidth: 20,
        borderRadius: 20,
    },
    labelError: {
        alignSelf: 'flex-start',
        color: '#ff375b',
        marginBottom: 8,
    }
});
