import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Button } from '../../Button/Button';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, doc, updateDoc, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { useUser } from '../Navigation/UserContext';
import ReturnButton from '../Navigation/goBackButton';

export default function TicketScreen({ navigation, route }) {
    const [disco, setDisco] = useState([]);
    const DiscoCollectionRef = collection(db, "discotecas");
    const [pulseiras, setPulseiras] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [userInfo, setUser] = useState([]);
    const { user } = useUser();
    const UserCollectionRef = collection(db, "utilizadores");
    const normalInputRef = useRef(null);
    const vipInputRef = useRef(null);
    const [quantities, setQuantities] = useState({ normal: 0, vip: 0 });
    const [totalPrice, setTotalPrice] = useState(0);
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredPulseiras, setFilteredPulseiras] = useState([]);

    useEffect(() => {
        const getDisco = async () => {
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
        };

        getDisco();
    }, [route.params]);

    useEffect(() => {
        const getUser = async () => {
            if (user?.uid) {
                try {
                    const querySnapshot = await getDocs(query(UserCollectionRef, where("id_Utilizador", "==", user?.uid)));
                    const userInfo = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    console.log("Utilizador Recebido:", userInfo);
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
            quantities.normal * filteredPulseiras[0].preco_normal +
            quantities.vip * filteredPulseiras[0].preco_vip
        );
    };

    const handleCheckout = () => {
        if (!selectedDate) {
            setMessage("Selecione uma data primeiro.");
            setShowMessage(true);
            return;
        }
        if (quantities.normal === 0 && quantities.vip === 0) {
            setMessage("Adicione pelo menos uma pulseira ao carrinho.");
            setShowMessage(true);
            return;
        }
       
        setTotalPrice(calculateTotalPrice());
        setModalVisible(true);
    };

    const handleInputChange = (key, value) => {
        const intValue = parseInt(value) || 0;
        setQuantities({ ...quantities, [key]: intValue });
    };

    const handlePurchase = async () => {
        if (userInfo.length === 0) {
            setMessage("Informações do usuário não encontradas.");
            setShowMessage(true);
            return;
        }

        if (userInfo[0].saldo < totalPrice) {
            setMessage("Saldo insuficiente.");
            setShowMessage(true);
            return;
        }

        if (!selectedDate) {
            setMessage("Selecione uma data primeiro.");
            setShowMessage(true);
            return;
        }

        const newSaldo = userInfo[0].saldo - totalPrice;

        try {
            const userDocRef = doc(db, "utilizadores", userInfo[0].id);
            await updateDoc(userDocRef, {
                saldo: newSaldo,
            });

            const bilhetesRef = collection(db, `utilizadores/${userInfo[0].id}/bilhetes`);
            await addDoc(bilhetesRef, {
                bilhete_id: user.uid,
                nome_discoteca: disco[0].nome_discoteca,
                utilizado: false,
                valor: totalPrice,
                bilhete_normal: quantities.normal,
                bilhete_vip: quantities.vip,
                data_compra: Timestamp.now()
            });

            if (filteredPulseiras.length > 0) {
                const pulseiraDocRef = doc(db, `discotecas/${disco[0].id}/bilhetes`, filteredPulseiras[0].id);
                const pulseiraDocSnapshot = await getDoc(pulseiraDocRef);
                const pulseiraData = pulseiraDocSnapshot.data();

                const novaLotacao = pulseiraData.lotacao - (quantities.normal + quantities.vip);

                await updateDoc(pulseiraDocRef, {
                    lotacao: novaLotacao,
                });
            }

            setUser([{ ...userInfo[0], saldo: newSaldo }]);
            setMessage("Compra efetuada com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar saldo do utilizador:", err);
            setMessage("Erro ao processar a compra.");
        }

        setShowMessage(true);
    };

    const handlePress = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (selectedDate) {
            const filtered = pulseiras.filter(pulseira => pulseira.date === selectedDate);
            setFilteredPulseiras(filtered);
        }
    }, [selectedDate, pulseiras]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#210042', '#5400A8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}>
            </LinearGradient>

            {disco.length > 0 && (
                <View style={styles.contentContainer}>
                    <ReturnButton />
                    <Image style={styles.logo} source={{ uri: disco[0].img_Logo }} accessible={true} accessibilityRole="image" accessibilityLabel='Imagem logo discoteca'/>
                    <Text style={{ marginTop: 80, marginLeft: 30, fontSize: 26, fontWeight: '900' }}>Reservar Pulseira</Text>

                    <TouchableOpacity style={styles.dateSelector} onPress={() => setDateModalVisible(true)} accessible={true} accessibilityRole="list" accessibilityLabel='Abre a lista de datas disponíveis para comprar pulseira'>
                        <Text>{selectedDate ? selectedDate : "Selecione uma Data"}</Text>
                    </TouchableOpacity>
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
                    
                    <TouchableOpacity style={styles.tickets} onPress={() => handlePress(normalInputRef)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para introduzir numeors de pulseiras normal'>
                        <View>
                            <Text style={styles.ticketsTitle}>Pulseira Normal</Text>
                            {filteredPulseiras.length > 0 ? (
                                <Text>{filteredPulseiras[0].preco_normal}€</Text>
                            ) : (
                                <Text>Esta discoteca/bar pode não ter entrada paga</Text>
                            )}
                        </View>
                        <TextInput
                            ref={normalInputRef}
                            style={styles.input}
                            keyboardType="numeric"
                            value={quantities.normal.toString()}
                            placeholder='0'
                            onChangeText={(value) => handleInputChange('normal', value)}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tickets} onPress={() => handlePress(vipInputRef)} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para introduzir numeors de pulseiras vip'>
                        <View>
                            <Text style={styles.ticketsTitle}>Pulseira VIP</Text>
                            {filteredPulseiras.length > 0 ? (
                                <Text>{filteredPulseiras[0].preco_vip}€</Text>
                            ) : (
                                <Text>Esta discoteca/bar pode não ter entrada paga</Text>
                            )}
                        </View>
                        <TextInput
                            ref={vipInputRef}
                            style={styles.input}
                            keyboardType="numeric"
                            value={quantities.vip.toString()}
                            placeholder='0'
                            onChangeText={(value) => handleInputChange('vip', value)}
                        />
                    </TouchableOpacity>

                    <View style={{ position: 'absolute', bottom: 15, width: '100%', alignItems: 'center' }}>
                        <Button title="Continuar" onPress={handleCheckout} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para continuar a compras '/>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton} accessible={true} accessibilityRole="button" accessibilityLabel='Botao fechar carrinho de compras'>
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
                                <Text style={styles.modalItem}>Normal:{quantities.normal} </Text>
                                <Text style={styles.modalItem}>VIP: {quantities.vip}</Text>
                                <Text style={styles.modalTotal}>Preço Total: {totalPrice.toFixed(2)} €</Text>
                                <Button title='Comprar' onPress={handlePurchase} accessible={true} accessibilityRole="button" accessibilityLabel='Botao para confirmar a compra' />
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
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
                            <Button title="Ver Compras" onPress={() => navigation.navigate('AccountScreen')} />
                            {message === "Saldo insuficiente." && (
                                <Button title="Adicionar Saldo" onPress={() => navigation.navigate('BalanceScreen')} />
                            )}
                            <Button title="Fechar" onPress={() => { setShowMessage(false); setModalVisible(false); }} />
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
        marginTop: 35,
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
    ticketsTitle: {
        width: 120,
        fontSize: 16,
        fontWeight: '700',
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
