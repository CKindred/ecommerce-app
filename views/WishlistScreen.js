import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import ProductViewer from '../components/ProductViewer';

const WishlistScreen = (props) => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await SecureStore.getItemAsync('JWT').then(value => {
                value = value.slice(1, -1);
                let jwt = ('Bearer ' + value);
                console.log('Using auth:', jwt);
                fetch('http://192.168.0.2:3001/wishlist', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log('RES', res.products);
                        setProducts(res.products);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        }
        fetchData();
    }, []);

    return (
        <View>
            <ProductViewer products={products} navigation={props.navigation} />
        </View>
    );
}

export default WishlistScreen;