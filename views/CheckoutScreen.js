import React from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Button } from 'react-native';
import { useGlobalState } from '../GlobalState';
import * as SecureStore from 'expo-secure-store';


const CheckoutScreen = (props) => {

    const req = {
        address: '',
        postcode: '',
        town: '',
        county: '',
        country: ''
    }

    const checkout = (details) => {
        console.log(details.address);
        SecureStore.getItemAsync('JWT').then(value => {
            value = value.slice(1, -1);
            let jwt = ('Bearer ' + value);
            console.log('Using auth:', jwt);
            fetch('http://192.168.0.2:3001/orders', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({
                    address: details.address,
                    postcode: details.postcode,
                    town: details.town,
                    county: details.county,
                    country: details.country
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
                        alert('Thankyou for placing your order.');
                    } else if (res === 401) {
                        setLoginModalVisible(true);
                        alert('Your session has expired, please log in again.');
                    } else if (res === 500) {
                        console.log(data);
                        alert(JSON.stringify(data.error.errors));
                    }
                })
        });
    }

    return (
        <View>
            <ScrollView>
                <TextInput style={styles.input} placeholder="Address" onChangeText={value => req.address = value} />
                <TextInput style={styles.input} placeholder="Postcode" onChangeText={value => req.postcode = value} />
                <TextInput style={styles.input} placeholder="Town" onChangeText={value => req.town = value} />
                <TextInput style={styles.input} placeholder="County" onChangeText={value => req.county = value} />
                <TextInput style={styles.input} placeholder="Country" onChangeText={value => req.country = value} />
            </ScrollView>
            <Button title="Checkout now" onPress={() => {
                checkout(req);
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'black',
        borderWidth: 1,
        margin: 5,
        padding: 5,
        borderRadius: 5
    }
});

export default CheckoutScreen;