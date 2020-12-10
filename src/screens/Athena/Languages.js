import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setCountry, setCity, setUser } from '@modules/reducers/auth/actions';
import { AuthService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { BackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Languages = (props) => {
    const dispatch = useDispatch();
    const { country, logged, city, user } = useSelector(state => state.auth);

    const [active, setActive] = useState(false);
    const [language, setLanguage] = useState(country === 'en' ? 0 : country === 'hu' ? 1 : 2);
    const [languages, setLanguages] = useState([
        { value: 0, label: 'English', code: 'en' },
        { value: 1, label: 'Hungarian', code: 'hu' },
        { value: 2, label: 'Romanian', code: 'ro' }
    ]);
    const [disabled, setDisabled] = useState(false);

    const checkCity = (cityObj) => {
        return cityObj.id == city.id;
    };
    const checkUserCity = (cityObj) => {
        return cityObj.id == user.city.id;
    };
    const onLanguage = () => {
        dispatch(setLoading(true));
        setDisabled(true);
        AuthService.cities(languages[language].code)
            .then(async (response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    var cityOne = await response.locations.filter(logged ? checkUserCity : checkCity);
                    dispatch(setCountry(languages[language].code));
                    i18n.setLocale(languages[language].code);
                    logged ? dispatch(setUser({
                        token: user.token,
                        email: user.email,
                        name: user.name,
                        city: {
                            id: cityOne[0].id,
                            name: cityOne[0].cities,
                            status: user.city.status
                        }
                    })) : dispatch(setCity({
                        id: cityOne[0].id,
                        name: cityOne[0].cities,
                        status: city.status
                    }))
                    props.navigation.pop();
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setDisabled(false);
            });
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.pop()}>
                        <BackIcon style={common.headerLeftIcon} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Languages selector')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => onLanguage()} disabled={disabled}>
                        <Text style={common.headerRightText}>{i18n.translate('Set')}</Text>
                    </TouchableOpacity>
                </View>
            </Header>
            <View style={styles.content}>
                <View style={styles.inputView}>
                    <Text style={styles.labelText}>{i18n.translate('Language of application')}</Text>
                    <TouchableOpacity style={styles.textContainer} onPress={() => setActive(!active)}>
                        <Text style={styles.itemText} numberOfLines={1}>{i18n.translate(languages[language].label)}</Text>
                        <Icon type='material' name='keyboard-arrow-down' size={30} color={colors.GREY.PRIMARY} />
                    </TouchableOpacity>
                </View>
                {active ? (
                    <View style={styles.listView}>
                        {languages.map((languageOne, key) => (
                            <TouchableOpacity key={key} style={[styles.itemView, key == languages.length - 1 && styles.noborder]} onPress={() => {
                                setActive(false);
                                setLanguage(languageOne.value);
                            }}>
                                <Text style={styles.itemText} numberOfLines={1}>{i18n.translate(languageOne.label)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : null}

            </View>
        </Container >
    );
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
        // height: 145,
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
});
