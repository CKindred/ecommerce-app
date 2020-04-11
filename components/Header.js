import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import BasketScreen from '../views/BasketScreen';

const Header = (props) => {

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{props.title}</Text>
            {/*<Button title="Basket"/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        paddingRight: 10
    }
});

export default Header;