import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import ProductViewer from '../components/ProductViewer';

const HomeScreen = ({ route, navigation }) => {
    const { filter } = route.params;
    const [products, setProducts] = useState([]);
    const isFoucsed = useIsFocused();
    console.log(filter);
    async function fetchData(query) {
        console.log('Fetching data...');
        console.log(`${'fetchdata '}http://192.168.0.2:3001/products${query}`);
        await fetch(`http://192.168.0.2:3001/products${query}`)
            .then(res => res.json())
            .then(res => {
                setProducts(res.products);
            })
            .catch((error) => {
                Alert.alert(
                    'Failed to retrieve products from server.',
                    'Are you connected to the internet?',
                    [
                      {text: 'Retry', onPress: () => fetchData(query)},
                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
                    ],
                    { cancelable: false }
                  )
            })
    }



    let queryString = '';

    useEffect(() => {
        console.log('Got filter', filter);
        queryString = '?' + Object.keys(filter).map(key => key + '=' + filter[key]).join('&');
        console.log(queryString);
        fetchData(queryString);
    }, [isFoucsed]);

    return (
        <View>
            <View style={styles.buttonContainer}>
                <Button title="Basket" onPress={() => navigation.navigate('Basket')} style={styles.button} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Wishlist" onPress={() => navigation.navigate('Wishlist')} style={styles.button} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Filter" onPress={() => navigation.navigate('Filter')} />
            </View>
            <View>
                <Text style={{ fontSize: 15, textAlign: 'center' }}>{products.length === 0 ? 'No products matched this search' : ''}</Text>
            </View>
            <View style={{ height: "78%" }}>
                <ProductViewer products={products} navigation={navigation} style={{ marginBottom: 10 }} isHomeScreen={true} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 3
    }
});

export default HomeScreen;