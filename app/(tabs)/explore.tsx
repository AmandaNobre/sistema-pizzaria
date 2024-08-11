
import {
  Image,
  StyleSheet,
  Modal,
  Pressable,
  View,
  TextInput
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

import React from 'react';
type TStatus = 'Em andamento' | 'Aguardando entregador' | 'Em entrega' | 'Concluído'

interface IProducts {
  id: number,
  name: string,
  price: number
}

export default function TabTwoScreen() {

  const defaultRequest: IProducts = {
    id: 1,
    name: '',
    price: 0,
  }

  const [listProducts, setlistProducts] = useState<IProducts[]>([])
  const [itensSelected, setItensSelected] = useState<IProducts[]>([])
  const [createVisible, setCreateVisible] = useState<boolean>(false)

  // form 
  const [request, setRequests] = useState<IProducts>(defaultRequest)

  const addListRequest = () => {
    const exist = listProducts.filter(f => f.id == request.id)[0]

    if (exist) {
      setlistProducts(listProducts.filter(f => f.id == request.id ? { ...request, itens: itensSelected } : request))
    } else {
      setlistProducts(prev => ([...prev, { ...request, itens: itensSelected }]))
    }

    setRequests({ ...defaultRequest, id: request.id + 1 })
    setCreateVisible(!createVisible)
    setItensSelected([])
    localStorage.setItem('products', JSON.stringify(listProducts))
  }

  const onChange = (value: string, name: string) => {
    setRequests({ ...request, [name]: value })
  }

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Produtos</ThemedText>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setCreateVisible(!createVisible)}>
            <ThemedText>Adicionar</ThemedText>
          </Pressable>
        </ThemedView>
        <ThemedView>

        </ThemedView>
        {listProducts.map((request, index) => (
          <ThemedView style={styles.stepContainer} key={index}>
            <ThemedText type="subtitle">{request.id}</ThemedText>
            <ThemedText type="subtitle">Nome: {request.name}</ThemedText>
            <ThemedText type="subtitle">Valor: R${request.price}</ThemedText>
          </ThemedView>
        ))}

      </ParallaxScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={createVisible}
        onRequestClose={() => {
          setCreateVisible(!createVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ThemedText type="subtitle">Adicionar Produto</ThemedText>
            <ThemedText>Nome</ThemedText>
            <TextInput
              style={styles.input}
              onChangeText={(value: string) => onChange(value, 'name')}
              value={request.name}
            />
            <ThemedText>Valor</ThemedText>
            <TextInput
              style={styles.input}
              onChangeText={(value: string) => onChange(value, 'price')}
              value={request.price as unknown as string}
              keyboardType="numeric"
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => addListRequest()}>
              <ThemedText>Adicionar</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setCreateVisible(!createVisible)}>
              <ThemedText>Cancelar</ThemedText>
            </Pressable>

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    height: 30,
    borderWidth: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
