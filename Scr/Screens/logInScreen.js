import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity,Modal, ActivityIndicator } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../Navigation/UserContext';

export default function LogInScreen({ navigate}) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useUser();
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [showModal, setShowModal] = useState(false);

    const schema = yup.object({
        email: yup.string().email("Email inválido").required("Preencha o email"),
        password: yup.string().min(6, "A password deve ter pelo menos 6 dígitos").required("Introduza uma password"),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const handleLogIn = async (data) => {
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            console.log('Login successful');
            setUser(userCredential.user);
            navigation.navigate('Home', { screen: 'HomeScreen' });
        } catch (error) {
            console.error('Error signing in: ', error);
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
                setError('Email inválido ou utilizador não encontrado.');
            } else if (error.code === 'auth/wrong-password') {
                setError('Password incorreta.');
            } else {
                setError('Erro ao tentar logar. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, forgotPasswordEmail);
            console.log('Password reset email sent');
            setShowModal(false);
        } catch (error) {
            console.error('Error sending password reset email: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <LinearGradient colors={['#F6F1F8', '#A437DB']} style={styles.gradient} />
            <View style={styles.contentContainer}>
                <Image style={styles.logo} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/logo.png?alt=media&token=ce41920e-2769-409b-ae57-d70fc90fdb45' }} />
                <Text style={{ marginBottom: 20, fontSize:18, fontWeight:'400' }}>NightOutNow</Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.textInput, errors.email && styles.inputError]}
                            placeholder='Email'
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email?.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.textInput, errors.password && styles.inputError]}
                            placeholder='Password'
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={true}
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password?.message}</Text>}

                {error && <Text style={styles.errorText}>{error}</Text>}

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Login" onPress={handleSubmit(handleLogIn)} />
                )}

                <SecondaryButton
                    title="Registar"
                    variant="v1"
                    onPress={() => navigation.navigate('SignUpScreen')}
                />
                <TouchableOpacity  onPress={() => setShowModal(true)}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Recuperar Password</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Introduza o seu email'
                            value={forgotPasswordEmail}
                            onChangeText={setForgotPasswordEmail}
                        />
                        <Button title="Enviar email de recuperação" onPress={handleForgotPassword} />
                    </View>
                </View>
            </Modal>
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
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
    },
    forgotPasswordText: {
        color: 'black',
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        width: '100%',
        height: '30%',
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
      closeButton: {
          position: 'absolute',
          top: 10,
          right: 10,
      },
      closeButtonText: {
          fontSize: 20,
          fontWeight: 'bold',
      },

});
