import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setDeliveryStatus } from '@modules/reducers/profile/actions';
import { AuthService, ProfileService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { MapPinIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default DeliveryAdd = (props) => {
    const dispatch = useDispatch();
    const { country, user } = useSelector(state => state.auth);
    const { deliveryStatus } = useSelector(state => state.profile);

    const [type] = useState(props.route.params.type);
    const [addressId] = useState(props.route.params.type === 2 ? props.route.params.item.id : 0);
    const [addressCity, setAddressCity] = useState(props.route.params.type === 2 ? props.route.params.item.city : user.city.name);
    const [errorCity, setErrorCity] = useState('');
    const [addressStreet, setAddressStreet] = useState(props.route.params.type === 2 ? props.route.params.item.street : '');
    const [errorStreet, setErrorStreet] = useState('');
    const [addressHouseNumber, setAddressHouseNumber] = useState(props.route.params.type === 2 ? props.route.params.item.houseNumber : '');
    const [errorHouseNumber, setErrorHouseNumber] = useState('');
    const [addressFloor, setAddressFloor] = useState(props.route.params.type === 2 ? props.route.params.item.floor : '');
    const [addressDoorNumber, setAddressDoorNumber] = useState(props.route.params.type === 2 ? props.route.params.item.doorNumber : '');

    const [active, setActive] = useState(false);
    const [citys, setCitys] = useState([]);
    const [cityObj, setCityObj] = useState(props.route.params.type === 2 ? props.route.params.item.city : { id: user.city.id, cities: user.city.name });
    // const [cityObj, setCityObj] = useState({ id: 0, cities: i18n.translate('Choose a city') });

    useEffect(() => {
        const checkCity = (city) => {
            return city.cities === props.route.params.item.city;
        }
        const getCities = () => {
            dispatch(setLoading(true));
            AuthService.cities(country)
                .then((response) => {
                    dispatch(setLoading(false));
                    if (response.status == 200) {
                        setCitys(response.locations);
                        if(props.route.params.type === 2){
                            var selectedCity = response.locations.filter(checkCity);
                            setCityObj(selectedCity[0]);
                        }
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
        setTimeout(() => getCities(), 500);

        return () => console.log('Unmounted');
    }, []);

    useEffect(() => setErrorCity(''), [active, addressCity, cityObj]);
    useEffect(() => setErrorStreet(''), [addressStreet]);
    useEffect(() => setErrorHouseNumber(''), [addressHouseNumber]);

    const onSave = () => {
        if ((!isEmpty(addressCity) && cityObj.id > 0) && !isEmpty(addressStreet) && !isEmpty(addressHouseNumber)) {
            dispatch(setLoading(true));
            ProfileService.setDeliveryAddress(user.token, addressId, addressCity, addressStreet, addressHouseNumber, addressFloor, addressDoorNumber)
                .then((response) => {
                    dispatch(setLoading(false));
                    dispatch(setDeliveryStatus(!deliveryStatus));
                    if (response.status == 201 || response.status == 200) {
                        props.navigation.replace('DeliverySuccess', { type });
                    } else {
                        props.navigation.push('DeliveryError');
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                    props.navigation.push('DeliveryError');
                });
        } else {
            if (cityObj.id == 0) setErrorCity('City is required');
            if (isEmpty(addressCity)) setErrorCity('City is required');
            if (isEmpty(addressStreet)) setErrorStreet('Street is required');
            if (isEmpty(addressHouseNumber)) setErrorHouseNumber('House number is required');
        }
    };

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon type='material' name='arrow-back' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{type === 1 ? i18n.translate('Create delivery address') : i18n.translate('Edit delivery address')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => onSave()}>
                        <Text style={common.headerRightText}>{i18n.translate('Set')}</Text>
                    </TouchableOpacity>
                </View>
            </Header>
            <View style={styles.content}>
                <View style={styles.selectView}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorCity) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Settlement')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorCity) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <TouchableOpacity style={[styles.selectContainer, !isEmpty(errorCity) ? common.borderColorRed : common.borderColorGrey]} onPress={() => setActive(!active)}>
                        <MapPinIcon />
                        <Text style={styles.itemText} numberOfLines={1}>{cityObj.cities}</Text>
                        <Icon type='material' name='keyboard-arrow-down' size={30} color={colors.GREY.PRIMARY} />
                    </TouchableOpacity>
                    {/* <Text style={common.errorText}>{errorCity}</Text> */}
                </View>
                {active ? (
                    <ScrollView style={styles.listView}>
                        {!isEmpty(citys) && citys.map((cityOne, key) => (
                            <TouchableOpacity key={key} style={[styles.itemView, key == citys.length - 1 && styles.noborder]} onPress={() => {
                                setActive(false);
                                setAddressCity(cityOne.cities);
                                setCityObj(cityOne);
                            }}>
                                <Text style={styles.itemText} numberOfLines={1}>{cityOne.cities}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                        <Fragment>
                            <View style={styles.streetView}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelText, !isEmpty(errorStreet) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Street')}</Text>
                                    <Text style={[styles.labelTextNormal, !isEmpty(errorStreet) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                                </View>
                                <TextField
                                    keyboardType='default'
                                    returnKeyType='next'
                                    fontSize={16}
                                    autoCorrect={false}
                                    enablesReturnKeyAutomatically={true}
                                    value={addressStreet}
                                    containerStyle={[styles.textContainer, !isEmpty(errorStreet) ? common.borderColorRed : common.borderColorGrey]}
                                    inputContainerStyle={styles.inputContainer}
                                    onChangeText={(value) => {
                                        setAddressStreet(value);
                                    }}
                                />
                                <Text style={common.errorText}>{errorStreet}</Text>
                            </View>
                            <View style={styles.threeView}>
                                <View style={styles.inputView}>
                                    <Text style={[styles.labelText, !isEmpty(errorHouseNumber) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('House number')}</Text>
                                    <Text style={[styles.labelTextNormal, !isEmpty(errorHouseNumber) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                                    <TextField
                                        keyboardType='default'
                                        returnKeyType='next'
                                        fontSize={16}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        value={addressHouseNumber}
                                        containerStyle={[styles.textContainer, !isEmpty(errorHouseNumber) ? common.borderColorRed : common.borderColorGrey]}
                                        inputContainerStyle={styles.inputContainer}
                                        onChangeText={(value) => {
                                            setAddressHouseNumber(value);
                                        }}
                                    />
                                    <Text style={common.errorText}>{errorHouseNumber}</Text>
                                </View>
                                <View style={styles.inputView}>
                                    <Text style={[styles.labelText, common.fontColorBlack]}>{i18n.translate('Floor')}</Text>
                                    <Text style={[styles.labelTextNormal, common.fontColorBlack]}> ({i18n.translate('Optional')})</Text>
                                    <TextField
                                        keyboardType='default'
                                        returnKeyType='next'
                                        fontSize={16}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        value={addressFloor}
                                        containerStyle={[styles.textContainer, common.borderColorGrey]}
                                        inputContainerStyle={styles.inputContainer}
                                        onChangeText={(value) => {
                                            setAddressFloor(value);
                                        }}
                                    />
                                </View>
                                <View style={styles.inputView}>
                                    <Text style={[styles.labelText, common.fontColorBlack]}>{i18n.translate('Door')}</Text>
                                    <Text style={[styles.labelTextNormal, common.fontColorBlack]}> ({i18n.translate('Optional')})</Text>
                                    <TextField
                                        keyboardType='default'
                                        fontSize={16}
                                        autoCorrect={false}
                                        enablesReturnKeyAutomatically={true}
                                        value={addressDoorNumber}
                                        containerStyle={[styles.textContainer, common.borderColorGrey]}
                                        inputContainerStyle={styles.inputContainer}
                                        onChangeText={(value) => {
                                            setAddressDoorNumber(value);
                                        }}
                                    />
                                </View>
                            </View>
                        </Fragment>
                    )}

            </View>
        </Container >
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    selectView: {
        marginTop: 20,
        width: '100%'
    },
    selectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 10,
        borderColor: colors.GREY.PRIMARY
    },
    streetView: {
        marginTop: 40,
        width: '100%'
    },
    threeView: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    inputView: {
        width: '30%'
    },
    textContainer: {
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0
    },
    itemText: {
        width: '75%',
        fontSize: 16,
        textAlign: 'left',
    },
    listView: {
        width: '100%',
        height: 250,
        paddingHorizontal: 10,
        backgroundColor: colors.WHITE,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.GREY.PRIMARY,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    itemView: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.GREY.PRIMARY
    },
    noborder: {
        borderBottomWidth: 0
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    labelTextNormal: {
        fontSize: 16,
        color: colors.BLACK
    },
});
