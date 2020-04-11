import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { createGlobalState } from 'react-hooks-global-state';
import * as SecureStore from 'expo-secure-store';
import { useGlobalState } from '../GlobalState';

import Signup from '../components/Signup';

const DetailsScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { name } = route.params;
    const { price } = route.params;
    const { productImage } = route.params;
    const { stock } = route.params
    console.log(id);

    const [basketCreated, setBasketCreated] = useGlobalState('basketCreated');
    const [cart, setCart] = useGlobalState('cart');
    const [loggedIn, setLoggedIn] = useGlobalState('loggedIn');
    const [loginModalVisible, setLoginModalVisible] = useGlobalState('loginModalVisible');

    const [modalVisible, setModalVisible] = useState(false);

    const createEmptyCart = (resolve, reject) => {
        SecureStore.getItemAsync('JWT').then(value => {
            console.log('****JWT****', value);
            value = value.slice(1, -1);
            let jwt = ('Bearer ' + value);
            console.log('Using auth:', jwt);
            fetch('http://192.168.0.2:3001/carts', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({
                    products: []
                }),
            })
                .then(res => {
                    const statusCode = res.status;
                    const data = res.json();
                    return Promise.all([statusCode, data]);
                })
                .then(([res, data]) => {
                    if (res === 201) {
                        console.log(JSON.stringify(data))
                        resolve(data._id);
                    } else if (res === 401) {
                        setLoginModalVisible(true);
                        alert('Your session has expired, please log in again.');
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject();
                });
        })
            .catch(err => {
                setLoginModalVisible(true);
                alert('Your session has expired, please log in again.');
            })
    }

    const updateCart = (cart, product, quantity) => {
        console.log('Product ID:', product);
        SecureStore.getItemAsync('JWT').then(value => {
            console.log('****JWT****', value);
            value = value.slice(1, -1);
            let jwt = 'Bearer ' + value;
            fetch(('http://192.168.0.2:3001/carts/' + cart), {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({
                    product: product,
                    quantity: quantity
                }),
            })
                .then(res => {
                    const statusCode = res.status;
                    const data = res.json();
                    return Promise.all([statusCode, data]);
                })
                .then(([res, data]) => {
                    if (res === 200) {
                        console.log(JSON.stringify(data));
                    } else if (res === 401) {
                        setLoginModalVisible(true);
                        alert('Your session has expired, please login again.')
                    } else if (res === 404) {
                        console.log(JSON.stringify(data));
                        setLoginModalVisible(true);
                        alert('Auth failed. try again');
                    }
                });
        });
    }

    const addToWishlist = (pid) => {
        console.log('PRODUCT ID', pid);
        SecureStore.getItemAsync('JWT').then(value => {
            value = value.slice(1, -1);
            let jwt = ('Bearer ' + value);
            console.log('Using auth:', jwt);
            fetch('http://192.168.0.2:3001/wishlist', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({
                    products: [
                        {
                            productId: pid
                        }
                    ]
                }),
            })
                .then(res => {
                    const statusCode = res.status;
                    const data = res.json();
                    return Promise.all([statusCode, data]);
                })
                .then(([res, data]) => {
                    if (res === 201) {
                        console.log(JSON.stringify(data))
                    } else if (res === 401) {
                        setLoginModalVisible(true);
                        alert('Your session has expired, please log in again.');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }



    return (
        <View>
            <Modal visible={loginModalVisible}>
                <Signup />
            </Modal>

            <Card image={{ uri: productImage }}>
                <Text style={{ marginBottom: 10, marginTop: 20 }} h2>{name}</Text>
                <Text h4>£{price}</Text>
                <Button
                    disabled={stock === 0 ? true : false}
                    title="Add to Basket"
                    type="clear"
                    onPress={() => {
                        if (!basketCreated) {
                            console.log('Creating new basket');
                            let p = new Promise(createEmptyCart);
                            p.then((createdCart) => {
                                setBasketCreated(true);
                                console.log("Basket successfully created");
                                console.log('Created cart:', createdCart);
                                setCart(createdCart);
                                updateCart(createdCart, id, 1);
                            })
                                .catch(() => {
                                    console.log('Failed to create basket');
                                });
                        } else {
                            console.log('Basket already created.')
                            updateCart(cart, id, 1);
                        }
                    }}
                />

                <Button
                    title="Add to Wishlist"
                    type="clear"
                    onPress={() => addToWishlist(id)}
                />

            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'red',
    }
});

export default DetailsScreen;