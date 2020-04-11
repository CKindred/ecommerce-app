import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { useGlobalState } from '../GlobalState';


const Signup = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginModalVisible, setLoginModalVisible] = useGlobalState('loginModalVisible');
    const [loggedIn, setLoggedIn] = useGlobalState('loggedIn');

    const signIn = (enteredEmail, enteredPassword) => {
        fetch('http://192.168.0.2:3001/user/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
            }),
        })
            .then((response) => {
                const statusCode = response.status;
                const data = response.json();
                return Promise.all([statusCode, data]);
            })
            .then(([res, data]) => {
                console.log(JSON.stringify(data));
                let token = JSON.stringify(data.token);
                if (res === 201) {
                    SecureStore.setItemAsync('JWT', token)
                        .then(() => {
                            console.log('Token:', JSON.stringify(data.token));
                            setLoggedIn(true);
                            setLoginModalVisible(false);
                            alert('You are now logged in.');
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (res === 401) {
                    alert('Failed to login, please try again.');
                }

            });
    }

    const createAccount = (enteredEmail, enteredPassword) => {
        fetch('http://192.168.0.2:3001/user/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
            }),
        })
            .then((response) => {
                const statusCode = response.status;
                const data = response.json();
                return Promise.all([statusCode, data]);
            })
            .then(([res, data]) => {
                const message = res === 201 ? 'Now please log in' : 'There was an error creating your account. Please try again.';
                alert(message);
            });
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text>Welcome to The Store</Text>
                <Text>Sign in or create an account below</Text>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={value => setEmail(value)}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={value => setPassword(value)}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Sign In" type="clear" onPress={() => signIn(email, password)
                    }
                    />
                    <Button title="Create Account" type="clear" onPress={() => createAccount(email, password)} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        width: '60%',
        marginBottom: 10,
        padding: 3

    },
    container: {
        padding: 10,
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row'
    }
});

export default Signup;