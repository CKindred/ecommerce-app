// src/components/Product.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';

const Product = (props) => {

    //console.log('THE ACTUAL PRODUCT', props.product);


    const removeProduct = (removeId) => {
        fetch('http://192.168.0.2:3001/wishlist', {
            method: 'DELETE'
        });
    }

    return (
        <Card
            image={{ uri: props.product.productImage }}>
            <Text style={{ marginBottom: 10, marginTop: 20 }} h2>
                {props.product.name}
            </Text>
            <Text style={styles.price} h4>
                £{props.product.price}
            </Text>
            <Text h6 style={styles.description}>
                {props.product.description}
            </Text>
            <Button
                type="clear"
                title="Details"
                onPress={() => props.navigation.navigate('Details', {
                    id: props.product._id,
                    name: props.product.name,
                    price: props.product.price,
                    productImage: props.product.productImage,
                    stock: props.product.stock
                })} />
            {/*<Button
                title="Remove"
                onPress={() => {}}
            />*/}
        </Card>
    );
}

const styles = StyleSheet.create({
    name: {

        color: '#5a647d',
        fontWeight: 'bold',
        fontSize: 30
    },
    price: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    description: {
        fontSize: 10,
        color: '#c1c4cd'
    },
});

export default Product;
