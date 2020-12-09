import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, BackHandler, StatusBar, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setCity, setUser } from '@modules/reducers/auth/actions';
import { AuthService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { MapPinIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Cities = (props) => {
    const dispatch = useDispatch();
    const { logged, country, user } = useSelector(state => state.auth);

    const [active, setActive] = useState(false);
    const [citys, setCitys] = useState([]);
    const [visible, setVisible] = useState(false);
    const [cityObj, setCityObj] = useState({ id: 0, cities: i18n.translate('Choose a city') });
    const [cityStatus, setCityStatus] = useState(false);

    useEffect(() => {
        const handleBackButton = () => { return true; }
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        const getCities = () => {
            dispatch(setLoading(true));
            AuthService.cities(country)
                .then((response) => {
                    dispatch(setLoading(false));
                    if (response.status == 200) {
                        setCitys(response.locations);
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
        setTimeout(() => getCities(), 500);

        return () => console.log('Unmounted');
    }, []);

    const onSave = () => {
        setVisible(false);
        !logged ? dispatch(setCity({
            id: cityObj.id,
            name: cityObj.cities,
            status: false
        })) : dispatch(setUser({
            token: user.token,
            email: user.email,
            city: {
                id: cityObj.id,
                name: cityObj.cities,
                status: false
            }
        }));
        props.navigation.navigate('App');
    };

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('City selector')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <View style={styles.content}>
                <View style={styles.inputView}>
                    <Text style={styles.labelText}>{i18n.translate('Where are you looking for a restaurant')}</Text>
                    <TouchableOpacity style={styles.textContainer} onPress={() => setActive(!active)}>
                        <MapPinIcon />
                        <Text style={styles.itemText} numberOfLines={1}>{cityObj.cities}</Text>
                        <Icon type='material' name='keyboard-arrow-down' size={30} color={colors.GREY.PRIMARY} />
                    </TouchableOpacity>
                </View>
                {active ? (
                    <ScrollView style={styles.listView}>
                        {!isEmpty(citys) && citys.map((cityOne, key) => (
                            <TouchableOpacity key={key} style={[styles.itemView, key == citys.length - 1 && styles.noborder]} onPress={() => {
                                setActive(false);
                                setCityObj(cityOne);
                                setCityStatus(true);
                            }}>
                                <Text style={styles.itemText} numberOfLines={1}>{cityOne.cities}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                        <View style={styles.inputView}>
                            <Text style={styles.searchLabel}>{i18n.translate('Quick search:')}</Text>
                            <View style={styles.searchView}>
                                {!isEmpty(citys) ? (
                                    <Fragment>
                                        <TouchableOpacity onPress={() => {
                                            setCityObj(citys[0]);
                                            setVisible(true);
                                            setCityStatus(true);
                                        }}>
                                            <Text style={styles.searchText}>{citys[0].cities}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setCityObj(citys[1]);
                                            setVisible(true);
                                            setCityStatus(true);
                                        }}>
                                            <Text style={styles.searchText}>{citys[1].cities}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setCityObj(citys[2]);
                                            setVisible(true);
                                            setCityStatus(true);
                                        }}>
                                            <Text style={styles.searchText}>{citys[2].cities}</Text>
                                        </TouchableOpacity>
                                    </Fragment>
                                ) : null}
                            </View>
                        </View>
                    )}

            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    disabled={!cityStatus ? true : false}
                    style={[common.button, !cityStatus ? common.backColorGrey : common.backColorYellow]} onPress={() => onSave()} >
                    <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Save')}</Text>
                </TouchableOpacity>
            </View>
            {visible ?
                <SaveModal
                    cityObj={cityObj}
                    onSave={() => onSave()}
                    onCancel={() => setVisible(false)} /> : null}
        </Container >
    );
}

const SaveModal = (props) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.modalView}>
                <View style={styles.modalMain}>
                    <Text style={styles.modalTitle}>{i18n.translate('Did you mean this city')}: {props.cityObj.cities}?</Text>
                    <Text style={styles.modalDescription}>{i18n.translate('You can edit the city later by clicking on the city in header')}</Text>
                </View>
                <TouchableOpacity style={styles.modalButton} onPress={props.onSave}>
                    <Text style={styles.saveText}>{i18n.translate('Save')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={props.onCancel}>
                    <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    inputView: {
        marginTop: 20,
        width: '100%'
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
    labelView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    searchLabel: {
        fontSize: 16,
        color: colors.BLACK
    },
    searchView: {
        width: '100%',
        flexWrap: "wrap",
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    searchText: {
        marginRight: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: colors.GREY.PRIMARY
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
    modalDescription: {
        width: '80%',
        textAlign: 'center',
        fontSize: 13,
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
    buttonView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('100%'),
        bottom: 50,
    }
});
