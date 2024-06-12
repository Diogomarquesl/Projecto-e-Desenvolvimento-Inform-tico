import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, updateDoc, doc } from 'firebase/firestore';
import ReturnButton from '../Navigation/goBackButton';
import { useUser } from '../Navigation/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../../Button/Button';
import { useFocusEffect } from '@react-navigation/native';

export default function AccountScreen({ navigation, route }) {
    const [userInfo, setUser] = useState([]);
    const { user } = useUser();
    const UserCollectionRef = collection(db, "utilizadores");
    const [purchases, setPurchases] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [accountModalVisible, setAccountModalVisible] = useState(false);
    const [ticketsModalVisible, setTicketsModalVisible] = useState(false);
    const [shoppingModalVisible, setShoppingModalVisible] = useState(false);
    const [pointsModalVisible, setPointsModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    
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

     
  

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.uri);
        }
    };

    const saveChanges = async () => {
        if (userInfo.length > 0) {
            const userDocRef = doc(db, "utilizadores", userInfo[0].id);
            try {
                await updateDoc(userDocRef, {
                    userName: newName,
                });

                setUser([{ ...userInfo[0], userName: newName }]);
                setAccountModalVisible(false);
            } catch (err) {
                console.error("Erro ao atualizar documento:", err);
            }
        }
    };

    const getUserPurchases = async () => {
        try {
            const userCollectionRef = collection(db, "utilizadores");
            const userQuery = query(userCollectionRef, where("id_Utilizador", "==", user.uid));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const purchasesCollectionRef = collection(userDoc.ref, "compras");
                const purchasesSnapshot = await getDocs(purchasesCollectionRef);

                const purchasesList = purchasesSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        data_compra: data.data_compra.toDate().toLocaleString('pt', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    };
                });

                console.log("Compras Recebidas:", purchasesList);
                setPurchases(purchasesList);
            } else {
                console.log("Utilizador não encontrado");
            }
        } catch (err) {
            console.error('Erro ao procurar compras: ', err);
        }
    };

    const getTicketPurchases = async () => {
        try {
            const userCollectionRef = collection(db, "utilizadores");
            const userQuery = query(userCollectionRef, where("id_Utilizador", "==", user.uid));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const ticketsCollectionRef = collection(userDoc.ref, "bilhetes");
                const ticketsSnapshot = await getDocs(ticketsCollectionRef);

                const ticketsList = ticketsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        data_compra: data.data_compra.toDate().toLocaleString('pt', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    };
                });

                console.log("Bilhetes Recebidos:", ticketsList);
                setTickets(ticketsList);
            } else {
                console.log("Utilizador não encontrado");
            }
        } catch (err) {
            console.error('Erro ao procurar bilhetes: ', err);
        }
    };    
   

    const exchangePointsForBalance = async () => {
        if (userInfo.length > 0) {
            const userDocRef = doc(db, "utilizadores", userInfo[0].id);
            const currentPoints = userInfo[0].pontos;

            if (currentPoints >= 10) {
                const newBalance = userInfo[0].saldo + Math.floor(currentPoints / 10);
                const remainingPoints = currentPoints % 10;

                try {
                    await updateDoc(userDocRef, {
                        saldo: newBalance,
                        pontos: remainingPoints,
                    });

                    setUser([{ ...userInfo[0], saldo: newBalance, pontos: remainingPoints }]);
                    alert('Pontos convertidos com sucesso!');
                } catch (err) {
                    console.error("Erro ao atualizar documento:", err);
                }
            } else {
                alert('Você precisa de pelo menos 10 pontos para trocar.');
            }
        }
    };
    useFocusEffect(
        useCallback(() => {
            getUser();
            getTicketPurchases();
            setTicketsModalVisible(false);
            getUserPurchases();
            setShoppingModalVisible(false);
           
        }, [])
    );
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#210042', '#5400A8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}>
            </LinearGradient>

            {userInfo.length > 0 && (
                <View style={styles.contentContainer}>
                    <ReturnButton />

                    <Image style={styles.logo} source={{ uri: userInfo[0].img_User }} />

                    <Text style={styles.userName}>{userInfo[0].userName}</Text>

                    <TouchableOpacity style={{ ...styles.options, marginTop: 20 }} onPress={() => setAccountModalVisible(true)}>
                        <Icon name="user" size={30} color="#000" />
                        <Text style={styles.title}>Dados Pessoais</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={accountModalVisible}
                        onRequestClose={() => setAccountModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={() => setAccountModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Atualizar Dados Pessoais</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Novo Nome"
                                    value={newName}
                                    onChangeText={setNewName}
                                />
                                <Button title="Selecionar Foto" onPress={pickImage} />
                                {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
                                <Button title="Salvar" onPress={saveChanges} />
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity style={styles.options} onPress={() => {
                        setTicketsModalVisible(true);
                        getTicketPurchases();
                    }}>
                        <Icon name="ticket" size={30} color="#000" />
                        <Text style={styles.title}>Bilhetes</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={ticketsModalVisible}
                        onRequestClose={() => setTicketsModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={() => setTicketsModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Bilhetes adquiridos</Text>
                                <FlatList
                                    data={tickets}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.transactions} onPress={() => {
                                            if (!item.utilizado) {
                                                navigation.navigate('QRScreen', { purchaseData: item });
                                            } else {
                                                alert('Este bilhete já foi utilizado.');
                                            }
                                        }}>
                                            <View>
                                                <Text>Data: {item.data_compra}</Text>
                                                <Text>{item.nome_discoteca}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 24, fontWeight: '500' }}> {item.valor.toFixed(2)}$</Text>
                                            </View>
                                            <View style={[styles.circle, item.utilizado ? styles.redCircle : styles.greenCircle]} />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity style={styles.options} onPress={() => {
                        setShoppingModalVisible(true);
                        getUserPurchases();
                    }}>
                        <Icon name="shopping-cart" size={30} color="#000" />
                        <Text style={styles.title}>Compras</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={shoppingModalVisible}
                        onRequestClose={() => setShoppingModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={() => setShoppingModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Compras efetuadas</Text>
                                <FlatList
                                    data={purchases}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.transactions} onPress={() => {
                                            if (!item.utilizado) {
                                                navigation.navigate('QRScreen', { purchaseData: item });
                                            } else {
                                                alert('Esta compra já foi utilizada.');
                                            }
                                        }}>
                                            <View>
                                                <Text>Data: {item.data_compra}</Text>
                                                <Text>{item.nome_discoteca}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 24, fontWeight: '500' }}> {item.valor.toFixed(2)}$</Text>
                                            </View>
                                            <View style={[styles.circle, item.utilizado ? styles.redCircle : styles.greenCircle]} />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity style={styles.options} onPress={() => setPointsModalVisible(true)}>
                        <Icon name="trophy" size={30} color="#000" />
                        <Text style={styles.title}>Pontos</Text>
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={pointsModalVisible}
                        onRequestClose={() => setPointsModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={() => setPointsModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Pontos (10 Pontos= 1$)</Text>
                                <Text>Saldo: {userInfo[0].saldo.toFixed(2)}$</Text>
                                <Text>Pontos: {userInfo[0].pontos}</Text>
                                <Button title="Trocar" onPress={exchangePointsForBalance} />
                            </View>
                        </View>
                    </Modal>
                </View>
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
        height: 140,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 360,
        alignSelf: 'center',
        top: -70,
        position: 'absolute',
    },
    userName: {
        marginTop: 80,
        fontSize: 26,
        fontWeight: '900',
        alignSelf: 'center'
    },
    options: {
        borderWidth: 1,
        borderColor: '#CFCFCF',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginLeft: 15
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#CFCFCF',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
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
    transactions: {
        borderWidth: 3,
        borderColor: '#CFCFCF',
        height: 120,
        width: '100%',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    greenCircle: {
        backgroundColor: 'green',
    },
    redCircle: {
        backgroundColor: 'red',
    },
});
