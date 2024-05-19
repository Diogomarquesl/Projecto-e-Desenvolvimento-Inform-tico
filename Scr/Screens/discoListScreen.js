import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, SafeAreaView, Modal } from 'react-native';
import { Button, SecondaryButton } from '../../Button/Button';
import { db } from '../../config/firebase';
import { getDocs, doc, collection, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { FiltroPreco } from '../Navigation/filtroPreco';
import { FiltroClassificacao } from '../Navigation/filtroClassificacao';
import { initializeApp, firebase } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function DiscoListScreen({ navigation, route }) {


  const [discoList, setDiscoList] = useState([]);

  const DiscoCollectionRef = collection(db, "discotecas");


  const selectedCity = route.params;

  const cityImages = {
    coimbra: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/coimbraNoite.jpg?alt=media&token=12516152-9a4d-4765-9695-4556674650fe',
    porto: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/Porto.jpg?alt=media&token=f3ad7b19-980f-427d-9414-ec23c946c401',
    lisboa: 'https://firebasestorage.googleapis.com/v0/b/pdinon2.appspot.com/o/Lisboa.jpg?alt=media&token=f80f4426-5fe3-4c07-9994-cfaf3379fe9a'
  };
  const cityTitle= {
    coimbra:'Coimbra',
    porto:'Porto',
    lisboa:'Lisboa'
  }
  console.log(selectedCity)

  useEffect(() => {
    const getDiscoList = async () => {
      try {
        const querySnapshot = await getDocs(query(DiscoCollectionRef, where("regiao", "==", route.params))); 
        const discos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Discotecas Recebidas:", discos);
        setDiscoList(discos);
      } catch (err) {
        console.error(err);
      }
    };

    getDiscoList();
  }, [route.params]);

  const ordenarPorPreco = (tipo) => {
    const discoOrdenado = [...discoList].sort((a, b) => {
      if (tipo === 'ascendente') {
        return a.preco - b.preco;
      } else if (tipo === 'descendente') {
        return b.preco - a.preco;
      }
      return 0;
    });
    setDiscoList(discoOrdenado);
  };
  const ordenarPorClassificacao = (tipo) => {
    const discoOrdenado = [...discoList].sort((a, b) => {
      if (tipo === 'ascendente') {
        return a.avaliacao - b.avaliacao;
      } else if (tipo === 'descendente') {
        return b.avaliacao - a.avaliacao;
      }
      return 0;
    });
    setDiscoList(discoOrdenado);
  };

  const onPressFunction = (item) => {
    navigation.navigate('DiscoScreen', item);
}


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPressFunction(item.nome_discoteca)}>
      <View style={styles.list}>
        <View style={styles.item_List}>
          <Image style={{ width: 90, height: 90, borderWidth: 3, borderColor: '#D284F6', borderRadius: 20, resizeMode: 'contain', backgroundColor: '#ffffff' }} source={{ uri: item.img_Logo }} />

          <Text style={{
            fontSize: 20, fontWeight: "bold", color: "#6F4E37",
            marginBottom: 16,
          }}> {item.nome_discoteca}</Text>
          <Text numberOfLines={5} style={{
            fontSize: 16, color: "#000",
          }}>
          </Text>
          <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 5, padding: 5 }}>
            <Text ><Ionicons name="star" size={24} color="#FFD700" /></Text>
            <Text>{item.avaliacao}/5</Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );







  return (
    <View style={{ flex: 1 }}>

      <View>
        <Image style={styles.header} source={{ uri: cityImages[selectedCity] }} />
        <Text style={{ fontSize: 48, alignSelf: 'center', marginTop: '25%', fontWeight: 700, color: '#ffffff' }}>
        {cityTitle[selectedCity]}</Text>
      </View>

      <View style={styles.contentContainer}>


        <View style={{ flexDirection: 'row', marginTop:10, width: '100%', justifyContent: 'space-around' }}>

          <FiltroPreco ordenarPorPreco={ordenarPorPreco} />
          <FiltroClassificacao ordenarPorClassificacao={ordenarPorClassificacao} />
          

        </View>

        <SafeAreaView style={{ marginTop: 20, paddingBottom: 60 }}>

          <FlatList
            data={discoList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}

          />

        </SafeAreaView>

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
  header: {
    position: 'absolute',
    width: '100%',
    height: 330,
    top: 0,

  },
  contentContainer: {
    height: "65%",
    width: '100%',
    position: 'absolute',
    bottom: -1,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    backgroundColor: '#F9F9F9',
  },

  list: {
    width: '100%',
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginTop: 5,
    backgroundColor: '#F2F1F1',
  },
  item_List:
  {
    width: '100%',
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  }

});
