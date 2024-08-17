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

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React from 'react';
type TStatus = 'Em andamento' | 'Aguardando entregador' | 'Em entrega' | 'Concluído'

interface IProducts {
  id: number,
  name: string,
  price: string
}

interface IRequests {
  id: number
  client: string,
  itens: IProducts[],
  priceTotal: number,
  address: string,
  status: TStatus
}

export default function HomeScreen() {

  const defaultRequest: IRequests = {
    id: 1,
    client: '',
    itens: [],
    priceTotal: 0,
    address: '',
    status: 'Em andamento'
  }

  const [listRequests, setListRequests] = useState<IRequests[]>([])
  const [itensSelected, setItensSelected] = useState<IProducts[]>([])
  const [updateStatusView, setUpdateStatusView] = useState<boolean>(false)
  const [idUpdate, setIdUpdate] = useState<number>(0)
  const [listStatus] = useState<Array<TStatus>>(['Em andamento', 'Aguardando entregador', 'Em entrega', 'Concluído'])
  const [listProducts, setListProducts] = useState<IProducts[]>([])

  const [createVisible, setCreateVisible] = useState<boolean>(false)

  // form 
  const [request, setRequests] = useState<IRequests>(defaultRequest)


  const getProducts = () => {
    try {
      const productsStorage = localStorage.getItem('products')
      if (productsStorage) {
        setListProducts(JSON.parse(productsStorage))
      }
    } catch {

    }

  }

  const addListRequest = () => {
    const exist = listRequests.filter(f => f.id == request.id)[0]

    if (exist) {
      setListRequests(listRequests.filter(f => f.id == request.id ? { ...request, itens: itensSelected } : request))
    } else {
      setListRequests(prev => ([...prev, { ...request, itens: itensSelected }]))
    }

    setRequests({ ...defaultRequest, id: request.id + 1 })
    setCreateVisible(!createVisible)
    setItensSelected([])
  }

  const onChange = (value: string, name: string) => {
    setRequests({ ...request, [name]: value })
  }

  const addItem = (item: IProducts) => {
    const lastId = itensSelected.length > 0 ? itensSelected[itensSelected.length - 1].id : 1
    setItensSelected(prev => ([...prev, { ...item, id: lastId + 1 }]))
  }

  const removeItemSelected = (id: number) => {
    setItensSelected(itensSelected.filter(f => f.id != id))
  }

  const calcPriceTotal = () => {
    let price = 0
    itensSelected.forEach(item => price = price + parseInt(item.price))
    setRequests({ ...request, priceTotal: price })
  }

  const updateStatus = (status: TStatus) => {
    const selected = listRequests.filter(f => f.id == idUpdate)[0]
    setListRequests(listRequests.filter(f => f.id != idUpdate))

    setListRequests(prevState => ([...prevState, { ...selected, status }]))
    setUpdateStatusView(false)
  }

  useEffect(() => { getProducts() }, [])
  useEffect(() => { calcPriceTotal() }, [itensSelected])

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/menu.jpg')}
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
            <ThemedText type="subtitle">{request.id} - {request.status}</ThemedText>
            <ThemedText type="subtitle">Cliente: {request.client}</ThemedText>
            <ThemedText type="subtitle">Endereço: {request.address}</ThemedText>
            <ThemedText type="subtitle">Preço total: R${request.priceTotal}</ThemedText>
            {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => editRequest(request)}>
              <ThemedText>Editar</ThemedText>
            </Pressable> */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setUpdateStatusView(!updateStatusView)
                setIdUpdate(request.id)
              }}>
              <ThemedText>Atualizar status</ThemedText>
            </Pressable>
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
              data={listProducts}
              search
              maxHeight={300}
              labelField="name"
              valueField="price"
              onChange={item => addItem(item)}
              placeholder='Selecionar itens'
            />

            {itensSelected.map((itenSelected, index) =>
              <View key={index} style={styles.titleContainer}>
                <ThemedText>{itenSelected.name} - R$ {itenSelected.price}</ThemedText>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => removeItemSelected(itenSelected.id)}>
                  <ThemedText>exluir</ThemedText>
                </Pressable>
              </View>
            )}
            <ThemedText>Total: R${request.priceTotal}</ThemedText>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={updateStatusView}
        onRequestClose={() => {
          setUpdateStatusView(!updateStatusView);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {listStatus.map((status, index) =>
              <Pressable
                key={index}
                style={[styles.button, styles.buttonClose]}
                onPress={() => updateStatus(status)}>
                <ThemedText>{status}</ThemedText>
              </Pressable>
            )}
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
