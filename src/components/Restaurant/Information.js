import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';

export default Information = (props) => {
    useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

    return (
        <View style={styles.container}>
            <Card key='INFORMATION' style={styles.card}>
                <Text style={styles.cardTitle}>{i18n.translate('INFORMATION & PROMOTIONS')}</Text>
            </Card>
            <Card key='Average' style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 16 }]}>{i18n.translate('Average delivery time')}</Text>
                <Text style={[styles.cardText, { fontSize: 16 }]}>{i18n.translate('Aproximativ')} {isEmpty(props.information.restaurant_avgTransport) ? 0 : props.information.restaurant_avgTransport} {i18n.translate('minute')}</Text>
            </Card>
            <Card key='Discount' style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 16 }]}>{i18n.translate('Discount')}</Text>
                <Text style={[styles.cardText, { fontSize: 16 }]}>{isEmpty(props.information.restaurant_discount) ? 0 : props.information.restaurant_discount}%</Text>
            </Card>
            <Card key='Aproximativ' style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 16 }]}>{i18n.translate('Address & Contact')}</Text>
                <Text style={[styles.cardText, { fontSize: 14 }]} numberOfLines={1}>{isEmpty(props.information.restaurant_address) ? '' : props.information.restaurant_address}</Text>
                <Text style={[styles.cardText, { marginTop: 10, fontSize: 14 }]}>{isEmpty(props.information.restaurant_phoneNumber) ? '' : props.information.restaurant_phoneNumber}</Text>
            </Card>
            <Card key='Description' style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 16 }]}>{i18n.translate('Description')}</Text>
                <Text style={[styles.cardText, { fontSize: 14 }]}>{isEmpty(props.information.restaurant_description) ? '' : props.information.restaurant_description}</Text>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        width: '100%',
        marginBottom: 15,
    },
    cardTitle: {
        marginVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        width: '100%'
    },
    cardText: {
        fontSize: 16,
        color: '#333',
        width: '100%'
    },
});