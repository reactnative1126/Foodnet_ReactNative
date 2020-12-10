import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setDeliveryStatus } from '@modules/reducers/profile/actions';
import { ProfileService } from '@modules/services';
import { common, colors } from '@constants/themes';
import { TrustIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default DeliveryList = (props) => {
    const dispatch = useDispatch();
    const { country, user } = useSelector(state => state.auth);
    const { deliveryStatus } = useSelector(state => state.profile);

    const [visible, setVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deliveryList, setDeliveryList] = useState([]);

    useEffect(() => {
        dispatch(setLoading(true));
        ProfileService.getDeliveryList(user.token, country)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setDeliveryList(response.result);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                console.log(error.message);
            });
    }, [deliveryStatus]);

    const onDelete = () => {
        setVisible(false);
        dispatch(setLoading(true));
        ProfileService.deleteDeliveryAddress(user.token, deleteId)
            .then(async (response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    dispatch(setDeliveryStatus(!deliveryStatus));
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
            });
    }

    const renderItem = (address, index) => {
        return (
            <View key={index} style={styles.address}>
                <Text style={styles.addressText} numberOfLines={2}>{address.item.doorNumber}, {address.item.floor}, {address.item.houseNumber}, {address.item.street}, {address.item.city}</Text>
                <View style={styles.addressOption}>
                    <TouchableOpacity onPress={() => props.navigation.push('DeliveryAdd', { type: 2, item: address.item })}>
                        <Text style={styles.addressEdit}>{i18n.translate('Edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setDeleteId(address.item.id);
                        setVisible(true);
                    }}>
                        <TrustIcon />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon type='material' name='arrow-back' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle}>
                    <Text style={common.headerTitleText} numberOfLines={1}>{i18n.translate('Delivery addresses')}</Text>
                </TouchableOpacity>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => props.navigation.push('DeliveryAdd', { type: 1, item: null })}>
                        <Icon type='material-community' name='plus' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
            </Header>
            <View style={{ flex: 1, padding: 20 }}>
                <View key='1' style={styles.status}>
                    <Text style={styles.statusText}>{i18n.translate('Title')}</Text>
                    <Text style={styles.statusText}>{i18n.translate('Operations')}</Text>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={deliveryList}
                    keyExtractor={(result, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>
            {visible ?
                <SaveModal
                    onDelete={() => onDelete()}
                    onCancel={() => setVisible(false)} /> : null}
        </Container>
    );
}

const SaveModal = (props) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.modalView}>
                <View style={styles.modalMain}>
                    <Text style={styles.modalTitle}>{i18n.translate('Are you sure you want to delete the delivery address?')}</Text>
                </View>
                <TouchableOpacity style={styles.modalButton} onPress={props.onDelete}>
                    <Text style={styles.saveText}>{i18n.translate('Delete')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={props.onCancel}>
                    <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    status: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 30,
        marginBottom: 5
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999999'
    },
    address: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4'
    },
    addressText: {
        width: '50%',
        fontSize: 16,
        lineHeight: 24,
        color: '#111'
    },
    addressOption: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 150
    },
    addressEdit: {
        marginRight: 20,
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
        color: colors.YELLOW.PRIMARY
    },
    modalContainer: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#00000080'
    },
    modalView: {
        justifyContent: 'space-between',
        width: wp('70%'),
        height: 200,
        backgroundColor: 'rgba(30, 30, 30, 0.75)',
        borderRadius: 14,
    },
    modalMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 110
    },
    modalTitle: {
        width: '80%',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 45,
        borderTopWidth: 2,
        borderTopColor: '#1E1E1E'
    },
    saveText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0AB4FF'
    },
    cancelText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#F05050'
    },
});