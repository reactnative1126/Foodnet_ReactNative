import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, NativeModules, StatusBar, StyleSheet, ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setCountry } from '@modules/reducers/auth/actions';
import { colors, common } from '@constants/themes';
import { images } from '@constants/assets';
import { LogoIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import Swiper from 'react-native-swiper';

const titles = [
    "Foodnet coupon code shopping",
    "Foodnet coupon code shopping",
    "Foodnet coupon code shopping",
];

export default Start = (props) => {
    const dispatch = useDispatch();
    const { country, city, user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(setLoading(false));
        const onLanguage = () => {
            const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;
            var deviceCode = deviceLanguage.substring(0, 2);
            if (deviceCode !== 'en' && deviceCode !== 'hu' && deviceCode !== 'ro') {
                deviceCode = 'en';
            };
            i18n.setLocale(deviceCode);
            dispatch(setCountry(deviceCode));
        }
        user.city.id === 0 && onLanguage();
        return () => console.log(country);
    }, []);

    return (
        <ImageBackground source={images.bgImage} style={common.container}>
            <StatusBar />
            <LogoIcon style={styles.logoIcon} />
            <View style={styles.descriptionView}>
                <Swiper
                    dotStyle={[styles.dotStyle, common.width10]}
                    activeDotStyle={[styles.dotStyle, common.width20]}
                    dotColor={colors.WHITE}
                    activeDotColor={colors.YELLOW.PRIMARY}
                >
                    {titles.map((title, key) => (
                        <Text key={key} style={styles.descriptionText}>{i18n.translate(title)}</Text>
                    ))}
                </Swiper>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.button, common.backColorYellow]} onPress={() => props.navigation.navigate('Auth', { screen: 'SignUp' })}>
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Registration')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, common.backColorWhite]} onPress={() => props.navigation.navigate('Auth', { screen: 'SignIn' })}>
                        <Text style={[common.buttonText, common.fontColorYellow]}>{i18n.translate('Log in')}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
                    city.id === 0 ? props.navigation.navigate('Cities') : props.navigation.navigate('App');
                }}>
                    <Text style={styles.continueText}>{i18n.translate('Continue without registration')}</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        width: wp('100%'),
        height: hp('100%'),
    },
    logoIcon: {
        top: hp('50%') - 190,
        left: 25,
        width: 100,
    },
    descriptionView: {
        top: hp('50%') - 150,
        left: 25,
        height: 100,
    },
    descriptionText: {
        width: 240,
        height: 72,
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 36,
        color: colors.WHITE,
    },
    dotStyle: {
        marginBottom: -20,
        height: 10,
        borderRadius: 5
    },
    bottomView: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        width: wp('100%'),
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 25,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('40%'),
        paddingVertical: 15,
        borderRadius: 6,
    },
    continueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.WHITE
    }
});