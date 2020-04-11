import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { useGlobalState } from '../GlobalState';

import Product from '../components/Product';
import ProductViewer from '../components/ProductViewer';

const BasketScreen = (props) => {
    const [basketItems, setBasketItems] = useState([]);
    const [loginModalVisible, setLoginModalVisible] = useGlobalState('loginModalVisible');

    useEffect(() => {
        const getBasket = () => {
            SecureStore.getItemAsync('JWT').then(value => {
                value = value.slice(1, -1);
                let jwt = ('Bearer ' + value);
                console.log('Using auth:', jwt);
                fetch('http://192.168.0.2:3001/carts/single', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                })
                    .then(response => {
                        const statusCode = response.status;
                        const data = response.json();
                        return Promise.all([statusCode, data]);
                    })
                    .then(([res, data]) => {
                        if (res === 200) {
                            console.log('Retrieved basket items successfully');
                            setBasketItems([...basketItems, ...data.products]);
                            console.log('Basket items', basketItems.toString());
                        } else if (res === 401) {
                            setLoginModalVisible(true);
                            alert('Your session has expired, please log in again.');

                        }
                    })
            })
        }
        getBasket();
    }, [])

    return (
        <View>
            <Button
                title="Checkout"
                onPress={() => props.navigation.navigate('Checkout')}
                disabled={basketItems.length === 0 ? true : false}
            />
            <Text>This is the basket</Text>
            <ProductViewer products={basketItems} navigation={props.navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 0,
        width: "100%",
        height: "100%",
        marginBottom: 20
    },
});

export default BasketScreen;