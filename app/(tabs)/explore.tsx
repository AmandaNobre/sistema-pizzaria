
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
import React from 'react';

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
  const [listProductsSearch, setlistProductsSearch] = useState<IProducts[]>([])
  const [itensSelected, setItensSelected] = useState<IProducts[]>([])
  const [createVisible, setCreateVisible] = useState<boolean>(false)

  // form 
  const [request, setRequests] = useState<IProducts>(defaultRequest)

  const addListRequest = () => {
    const exist = listProducts.filter(f => f.id == request.id)[0]

    if (exist) {
      removeProduct(exist.id)
      setlistProducts(prevState => ([...prevState, { ...request }]))
    } else {
      setlistProducts(prev => ([...prev, { ...request, itens: itensSelected }]))
    }

    setRequests({ ...defaultRequest, id: request.id + 1 })
    setCreateVisible(!createVisible)
    setItensSelected([])
  }

  const onChange = (value: string, name: string) => {
    setRequests({ ...request, [name]: value })
  }

  const removeProduct = (id: number) => {
    setlistProducts(listProducts.filter(f => f.id != id))
  }

  const viewEdit = (product: IProducts) => {
    setRequests(product)
    setCreateVisible(!createVisible)
  }

  const search = (value: string) => {
    setlistProductsSearch(listProducts.filter(f => f.name.includes(value)))
  }
  useEffect(() => { setlistProductsSearch(listProducts); localStorage.setItem('products', JSON.stringify(listProducts)) }, [listProducts])

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/food.jpg')}
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
        <TextInput
          style={styles.input}
          onChangeText={(value: string) => search(value)}
          placeholder='Pesquisar'
        />
        {listProductsSearch.map((request, index) => (
          <ThemedView style={styles.stepContainer} key={index}>
            <ThemedText type="subtitle">{request.name} - R${request.price}</ThemedText>
            <ThemedView style={styles.buttonsAction}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => removeProduct(request.id)}>
                <ThemedText>Excluir</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => viewEdit(request)}>
                <ThemedText>Editar</ThemedText>
              </Pressable>
            </ThemedView>
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
            <ThemedView style={styles.titleContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setCreateVisible(!createVisible)}>
                <ThemedText>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => addListRequest()}>
                <ThemedText>Adicionar</ThemedText>
              </Pressable>
            </ThemedView>

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
    justifyContent: 'space-between',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonsAction: {
    flexDirection: 'row',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: 400,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
