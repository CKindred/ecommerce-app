import React, { useState } from 'react';
import { Text, View, StyleSheet, Modal, TextInput } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Button } from 'react-native-elements';



let radio_props_colors = [
    { label: 'White', value: 'white' },
    { label: 'Black', value: 'black' }
];

let radio_props_sizes = [
    { label: '60%', value: '60%' },
    { label: '100%', value: '100%' }
];

let radio_props_connection = [
    { label: 'Wired', value: 'false' },
    { label: 'Wireless', value: 'true' }
];

const FilterScreen = (props) => {

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [filter, setFilter] = useState({});
    

    return (
        <Modal visible={props.visible}>
            <View style={styles.row}>
                <Text>Color:</Text>
                <RadioForm
                    radio_props={radio_props_colors}
                    initial={-1}
                    onPress={(value) => setFilter({...filter, color: value})}
                    style={styles.radio}
                />
            </View>
            <View style={styles.row}>
                <Text>Size:</Text>
                <RadioForm
                    radio_props={radio_props_sizes}
                    initial={-1}
                    onPress={(value) => setFilter({...filter, size: value})}
                    style={styles.radio}
                />
            </View>
            <View style={styles.row}>
                <Text>Connection Type:</Text>
                <RadioForm
                    radio_props={radio_props_connection}
                    initial={-1}
                    onPress={(value) => setFilter({...filter, wireless: value})}
                    style={styles.radio}
                />
            </View>
            <View style={styles.row}> 
                <Text>Price Range:</Text>
                <TextInput
                    placeholder="Min Price"
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(value) => setFilter({...filter, priceMin: value})}
                    maxLength={5}
                />
                <TextInput
                    placeholder="Max Price"
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(value) => setFilter({...filter, priceMax: value})}
                    maxLength={5}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="GO"
                    onPress={() => {
                        props.navigation.navigate('Home', {
                            filter: filter
                        });
                    }}
                />
            </View>
        </Modal>
    );
}

export default FilterScreen;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5
    },
    radio: {
        flexDirection: 'row'
    },
    input: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        padding: 5
    }

});