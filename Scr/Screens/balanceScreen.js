import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../Navigation/UserContext';
import ReturnButton from '../Navigation/goBackButton';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function BalanceScreen({ navigation }) {
  const { user } = useUser();
  const [saldo, setSaldo] = useState(null);
  const [userInfo, setUser] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const UserCollectionRef = collection(db, "utilizadores");

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
            tipo: 'compra',
            ...data,
            data_compra: data.data_compra.toDate(), 
          };
        });

        return purchasesList;
      } else {
        console.log("Utilizador não encontrado");
        return [];
      }
    } catch (err) {
      console.error('Erro ao buscar compras: ', err);
      return [];
    }
  };

  const getUserTickets = async () => {
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
            tipo: 'bilhete',
            ...data,
            data_compra: data.data_compra.toDate(), 
          };
        });

        return ticketsList;
      } else {
        console.log("Utilizador não encontrado");
        return [];
      }
    } catch (err) {
      console.error('Erro ao buscar bilhetes: ', err);
      return [];
    }
  };

  const getTransactions = async () => {
    const purchases = await getUserPurchases();
    const tickets = await getUserTickets();

    const allTransactions = [...purchases, ...tickets];
    allTransactions.sort((a, b) => b.data_compra - a.data_compra); 
    setTransactions(allTransactions.slice(0, 15));
  };

  const renderIcon = (tipo) => {
    if (tipo === 'compra') {
      return <MaterialIcons name="sports-bar" size={34} color="black" />;
    } else if (tipo === 'bilhete') {
      return <MaterialIcons name="confirmation-number" size={34} color="black" />;
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
      getTransactions();
    }, [])
  );

  return (
    <View style={styles.container}>
      {userInfo.length > 0 && (
        <>
          <StatusBar style="light" />
          <LinearGradient
            colors={['#210042', '#5400A8']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}>
            <Text style={styles.headerText}  accessible={true} accessibilityRole="text" accessibilityLabel='Saldo do utilizador'
              >Saldo:</Text>
            <Text style={{ fontSize: 45, color: '#fff', top: 60 }}>{userInfo[0].saldo.toFixed(2)}</Text>
          </LinearGradient>

          <View style={styles.contentContainer}>
            <View style={styles.controlerContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('DepositScreen')} style={[styles.pressable, styles.pressableTop]} accessible={true} accessibilityRole="imagebutton" accessibilityLabel='Redireciona para a tela onde se carrega app com dinheiro'>
                <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/iconDinheiro.png?alt=media&token=85febe36-2204-410e-9bfd-b59f6253790e' }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('DepositScreen')} style={[styles.pressable, styles.pressableTop]} />
            </View>

            <Text style={{ marginTop: 65, marginLeft: 30, fontSize: 20, fontWeight: '900' }}>Transações</Text>
            <ReturnButton />
            <FlatList
              data={transactions}
              accessible={true} accessibilityRole="list" accessibilityLabel='Lista das transações feitas'
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.transactions}>
                  <View style={styles.transactionIcon}>
                    {renderIcon(item.tipo)}
                  </View>
                  <View>
                    <Text>Data: {item.data_compra.toLocaleString('pt', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</Text>
                    <Text>{item.nome_discoteca}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: '500' }}> {item.valor.toFixed(2)}$</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </>
      )}
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
    width: '100%',
    height: '70%',
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
  headerText: {
    fontSize: 20,
    color: '#FFFFFF',
    top: 50,
  },
  controlerContainer: {
    width: '70%',
    height: 60,
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    top: -30,
    borderRadius: 15,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pressable: {
    width: '20%',
    height: '100%',
  },
  icons: {
    width: '90%',
    height: '90%',
  },
  transactions: {
    borderWidth: 3,
    borderColor: '#CFCFCF',
    height: 120,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  transactionIcon: {
    marginRight: 10,
  },
});