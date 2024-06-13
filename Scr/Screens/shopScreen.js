import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Button } from '../../Button/Button';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import ReturnButton from '../Navigation/goBackButton';
import { useUser } from '../Navigation/UserContext';

export default function ShopScreen({ navigation, route }) {
    const [disco, setDisco] = useState([]);
    const DiscoCollectionRef = collection(db, "discotecas");
    const [pulseiras, setPulseiras] = useState([]);
    const [quantities, setQuantities] = useState({ fino: 0, shot: 0, bebidaBranca: 0 });
    const [number, setNumber] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useUser();
    const finoInputRef = useRef(null);
    const shotInputRef = useRef(null);
    const bebidaBrancaInputRef = useRef(null);
    const [userInfo, setUser] = useState([]);
    const UserCollectionRef = collection(db, "utilizadores");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const getDisco = async () => {
            try {
                const querySnapshot = await getDocs(query(DiscoCollectionRef, where("nome_discoteca", "==", route.params)));
                const disco = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDisco(disco);
                if (disco.length > 0) {
                    const discoId = disco[0].id;
                    setPulseiras(pulseiras);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getDisco();
    }, [route.params]);

    useEffect(() => {
        const getUser = async () => {
            if (user?.uid) {
                try {
                    const querySnapshot = await getDocs(query(UserCollectionRef, where("id_Utilizador", "==", user?.uid)));
                    const userInfo = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUser(userInfo);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        getUser();
    }, []);

    const calculateTotalPrice = () => {
        return (
            quantities.fino * disco[0].preco_Fino +
            quantities.shot * disco[0].preco_Shot +
            quantities.bebidaBranca * disco[0].preco_BebidaBranca
        );
    };

    const handleInputChange = (key, value) => {
        const intValue = parseInt(value) || 0;
        setQuantities({ ...quantities, [key]: intValue });
    };

    const handleCheckout = () => {
        if (quantities.fino === 0 && quantities.shot === 0 && quantities.bebidaBranca === 0) {
            setMessage("Adicione pelo menos uma pulseira ao carrinho.");
            setShowMessage(true);
            return;
        }
        setTotalPrice(calculateTotalPrice());
        setModalVisible(true);
    };

    const handlePurchase = async () => {
        if (userInfo.length > 0 && userInfo[0].saldo >= totalPrice) {
            const newSaldo = userInfo[0].saldo - totalPrice;
            try {
                const userDocRef = doc(db, "utilizadores", userInfo[0].id);
                await updateDoc(userDocRef, { saldo: newSaldo });

                const comprasRef = collection(db, `utilizadores/${userInfo[0].id}/compras`);
                await addDoc(comprasRef, {
                    compra_id: user.uid,
                    nome_discoteca: disco[0].nome_discoteca,
                    utilizado: false,
                    valor: totalPrice,
                    finos: quantities.fino,
                    shot: quantities.shot,
                    bebidaBranca: quantities.bebidaBranca,
                    data_compra: Timestamp.now()
                });

                setUser([{ ...userInfo[0], saldo: newSaldo }]);
                setMessage("Compra efetuada com sucesso!");
               
            } catch (err) {
                console.error("Erro ao atualizar saldo do utilizador:", err);
                setMessage("Erro ao processar a compra.");
            }
        } else {
            setMessage("Saldo insuficiente.");
        }
        setShowMessage(true);
    };

    const handlePress = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para fechar aba de saldo'>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.headerModal}>
                            {userInfo.length > 0 ? (
                                <>
                                    <Text>{userInfo[0].userName}</Text>
                                    <Text>Saldo: {userInfo[0].saldo.toFixed(2)}$</Text>
                                </>
                            ) : (
                                <Text>Carregando...</Text>
                            )}
                        </View>
                        <Text style={styles.modalTitle}>Resumo do Pedido</Text>
                        <Text style={styles.modalItem}>Fino: {quantities.fino}</Text>
                        <Text style={styles.modalItem}>Shot: {quantities.shot}</Text>
                        <Text style={styles.modalItem}>Bebida Branca: {quantities.bebidaBranca}</Text>
                        <Text style={styles.modalTotal}>Preço Total: {totalPrice.toFixed(2)}€</Text>
                        <Button title='Comprar' onPress={handlePurchase} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para confirmar conta'/>
                    </View>
                </View>
            </Modal>

            <StatusBar style="light" />
            <LinearGradient
                colors={['#210042', '#5400A8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <ReturnButton accessible={true} accessibilityRole="button" accessibilityLabel='Botao para ir para a tela anterior' />
                {disco.length > 0 ? (
                    <Image style={styles.logo} source={{ uri: disco[0].img_Logo }} accessible={true} accessibilityRole="image" accessibilityLabel='imagem logotipo da discoteca' />
                ) : (
                    <Text>Carregando...</Text>
                )}
                <Text style={{ marginTop: 80, marginLeft: 30, fontSize: 26, fontWeight: '900' }}>Compra aqui a tua bebida</Text>

                <TouchableOpacity style={styles.tickets} onPress={() => handlePress(finoInputRef)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para selecionar quatidade de finos'>
                    <Image style={styles.icon} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/finoIcon.png?alt=media&token=c1ecdf0a-8f00-4ae3-bad2-ef1a12c8e9a1' }} />
                    <View>
                        <Text style={{ width: 95 }}>Fino</Text>
                        {disco.length > 0 ? (
                            <Text>{disco[0].preco_Fino}€</Text>
                        ) : (
                            <Text>Carregando...</Text>
                        )}
                    </View>
                    <TextInput
                        ref={finoInputRef}
                        style={styles.input}
                        keyboardType="numeric"
                        value={quantities.fino.toString()}
                        placeholder='0'
                        onChangeText={(value) => handleInputChange('fino', value)}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.tickets} onPress={() => handlePress(shotInputRef)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para selecionar quantidade de shots'>
                    <Image style={styles.icon} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/shotIcon2.png?alt=media&token=d6850b3c-d187-42f0-bee5-89e8e4342a7f' }} />
                    <View>
                        <Text style={{ width: 95 }}>Shot</Text>
                        {disco.length > 0 ? (
                            <Text>{disco[0].preco_Shot}€</Text>
                        ) : (
                            <Text>Carregando...</Text>
                        )}
                    </View>
                    <TextInput
                        ref={shotInputRef}
                        style={styles.input}
                        keyboardType="numeric"
                        value={quantities.shot.toString()}
                        placeholder='0'
                        onChangeText={(value) => handleInputChange('shot', value)}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.tickets} onPress={() => handlePress(bebidaBrancaInputRef)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para selecionar quantidade de bebida branca'>
                    <Image style={styles.icon} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/bebidaBrancaIcon.png?alt=media&token=7f6d5d5f-deb8-415f-9855-eab42148824f' }} />
                    <View>
                        <Text style={{ width: 95 }}>Bebida Branca</Text>
                        {disco.length > 0 ? (
                            <Text>{disco[0].preco_BebidaBranca}€</Text>
                        ) : (
                            <Text>Carregando...</Text>
                        )}
                    </View>
                    <TextInput
                        ref={bebidaBrancaInputRef}
                        style={styles.input}
                        keyboardType="numeric"
                        value={quantities.bebidaBranca.toString()}
                        placeholder='0'
                        onChangeText={(value) => handleInputChange('bebidaBranca', value)}
                    />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Button title="Continuar" onPress={handleCheckout} />
                </View>
            </View>

            {showMessage && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showMessage}
                    onRequestClose={() => setShowMessage(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{message}</Text>
                            <Button title="Ver Compras" onPress={() => navigation.navigate('AccountScreen')} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para ir para a tela de conta'/>
                            {message === "Saldo insuficiente." && (
                                <Button title="Adicionar Saldo" onPress={() => navigation.navigate('BalanceScreen')} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para ir paara a tela de adicionar saldo '/>
                            )}
                            
                            <Button title="Fechar" onPress={() => {setShowMessage(false); setModalVisible(false); }} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9F9F9'
    },
    contentContainer: {
        width: '100%',
        height: '80%',
        position: 'absolute',
        bottom: 0,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: '#F9F9F9',
    },
    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    logo: {
        height: '20%',
        width: '20%',
        borderWidth: 3,
        borderColor: '#ffffff',
        borderRadius: 20,
        alignSelf: 'center',
        top: '-10%',
        marginLeft: '11%',
        position: 'absolute',
    },
    tickets: {
        borderWidth: 3,
        borderColor: '#CFCFCF',
        height: 120,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    input: {
        width: 40,
        height: 40,
        backgroundColor: '#D9D9D9',
        textAlign: 'center'
    },
    icon: {
        height: 55,
        width: 55,
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
    modalTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
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
