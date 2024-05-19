import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { Filtro1 } from '../Navigation/filtroPreco';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { Pressable } from 'react-native';
import { useUser } from '../Navigation/UserContext';
import ReturnButton from '../Navigation/goBackButton';


const onPressFunction = () => {
  console.log("nhdfj");
}







export default function BalanceScreen() {
  const { user } = useUser();
  const [saldo, setSaldo] = useState(null);
  const [userInfo, setUser] = useState([]);
  const UserCollectionRef = collection(db, "utilizadores");
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
        <Text style={styles.headerText}>Saldo:</Text>
        <Text style={{ fontSize: 45, color: '#fff', top: 60 }}>{userInfo[0].saldo}</Text>
      </LinearGradient>
     




      <View style={styles.contentContainer}>
        <View style={styles.controlerContainer}>
          <TouchableOpacity onPress={onPressFunction} style={[styles.pressable, styles.pressableTop]}>
            <Image style={styles.icons} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/iconDinheiro.png?alt=media&token=85febe36-2204-410e-9bfd-b59f6253790e' }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressFunction} style={[styles.pressable, styles.pressableTop]}>

          </TouchableOpacity>
        </View>


        <Text style={{ marginTop: 65, marginLeft: 30, fontSize: 20, fontWeight: '900' }}>Transações</Text>
        <ReturnButton />



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
    height: '90%'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }

});