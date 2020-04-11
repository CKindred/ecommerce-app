import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import {Button} from 'react-native-elements';

import Product from './Product';
import SmallProduct from './SmallProduct';

const ProductViewer = (props) => {

    return (
        <View style={styles.screen}>
            <ScrollView style={styles.scroll}>
                {
                    props.products.map((product, index) => {
                        return (
                            <View style={styles.row} key={index}>
                                <View style={styles.col}>
                                <SmallProduct style={styles.product} navigation={props.navigation} product={props.isHomeScreen === true ? product : product.productId} />
                                </View>
                            </View>
                        );
                    })
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    col: {
        flex: 1
    },
    scroll: {
        flexGrow: 1,
        width: "100%",
        height: "100%",
    },
    product: {
        width: '50%'
    },
    screen: {
        
    }
});

export default ProductViewer;