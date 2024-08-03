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

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React from 'react';

interface IProducts {
  name: string,
  price: number
}

interface IItens {
  name: string,
  // qtd: number,
  price: number
}

interface IRequests {
  client: string,
  itens: IItens[],
  priceTotal: number,
  address: string,
  status: 'Em andamento' | 'Aguardando entregador' | 'Em entrega' | 'Concluído'
}


interface IValue {
  value: string
}

export default function HomeScreen() {

  const defaultRequest: IRequests = {
    client: '',
    itens: [],
    priceTotal: 0,
    address: '',
    status: 'Em andamento'
  }

  const [listRequests, setListRequests] = useState<IRequests[]>([])
  const [itensSelected, setItensSelected] = useState<IItens[]>([])
  const [listProducts, setListProducts] = useState<IProducts[]>([{ name: 'teste ', price: 1 }, { name: 'teste 2', price: 1 }])

  const [createVisible, setCreateVisible] = useState<boolean>(false)

  // form 
  const [request, setRequests] = useState<IRequests>(defaultRequest)


  const getProducts = async () => {
    try {
      // await AsyncStorage.setItem('products', JSON.stringify([{ name: 'teste', price: 20.0 }]))
      // const productsStorage = await AsyncStorage.getItem('products')
      // if (productsStorage) {
      //   setListProducts(JSON.parse(productsStorage))
      // }
    } catch {

    }

  }

  const addListRequest = () => {
    setListRequests(prev => ([...prev, request]))
    setRequests(defaultRequest)
    setCreateVisible(!createVisible)
  }

  const onChange = (value: string, name: string) => {
    setRequests({ ...request, [name]: value })
  }

  const addItem = (item: IProducts) => {
    request.itens.push(item)
    setItensSelected(prev => ([...prev, item]))

    console.log('request', request)
  }

  useEffect(() => { getProducts() }, [])

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
          <ThemedText type="title">Pedidos</ThemedText>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setCreateVisible(!createVisible)}>
            <ThemedText>Adicionar</ThemedText>
          </Pressable>
        </ThemedView>
        <ThemedView>

        </ThemedView>
        {listRequests.map((request, index) => (
          <ThemedView style={styles.stepContainer} key={index}>
            <ThemedText type="subtitle">CLiente: {request.client}</ThemedText>
            <ThemedText>
              Tap the Explore tab to learn more about what's included in this starter app.
            </ThemedText>
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
            <ThemedText type="subtitle">Adicionar Pedido</ThemedText>
            <ThemedText>Nome Cliente</ThemedText>
            <TextInput
              style={styles.input}
              onChangeText={(value: string) => onChange(value, 'client')}
              value={request.client}
            />
            <ThemedText>Endereço</ThemedText>
            <TextInput
              style={styles.input}
              onChangeText={(value: string) => onChange(value, 'address')}
              value={request.address}
            />
            <ThemedText>Itens</ThemedText>
            <Dropdown
              // style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              // placeholderStyle={styles.placeholderStyle}
              // selectedTextStyle={styles.selectedTextStyle}
              // inputSearchStyle={styles.inputSearchStyle}
              // iconStyle={styles.iconStyle}
              data={listProducts}
              search
              maxHeight={300}
              labelField="name"
              valueField="price"
              onChange={item => addItem(item)}
            />
            <ThemedText>Itens selecionados</ThemedText>

            {itensSelected.map((itenSelected, index) =>
              <ThemedText key={index}>{itenSelected.name}</ThemedText>
            )}
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
