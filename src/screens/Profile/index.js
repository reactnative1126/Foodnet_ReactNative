import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, deleteUser } from '@modules/reducers/auth/actions';
import { ProfileService } from '@modules/services';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

export default Profile = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const onLogout = () => {
        dispatch(deleteUser({
            token: null,
            email: user.email,
            city: {
                id: user.city.id,
                name: user.city.name,
                status: false
            }
        }));
        props.navigation.reset({ index: 1, routes: [{ name: 'Start' }] })
    }

    const goProfileEdit = () => {
        dispatch(setLoading(true));
        ProfileService.getProfileInformation(user.token)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    props.navigation.push('ProfileEdit', { userInfo: response.result });
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
            });
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon type='ionicon' name='ios-close' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle}>
                    <Text style={common.headerTitleText} numberOfLines={1}>{user.token}</Text>
                </TouchableOpacity>
                <View style={common.headerRight} />
            </Header>
            <Content contentContainerStyle={{ padding: 20 }}>
                <TouchableOpacity key='1' style={styles.item} onPress={() => props.navigation.push('DeliveryList')}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Delivery addresses list')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='2' style={styles.item} onPress={() => goProfileEdit()}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Edit profile information')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='3' style={styles.item} onPress={() => props.navigation.push('PasswordChange')}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Change password')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='4' style={styles.item} onPress={() => props.navigation.push('CouponCodes')}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Coupon codes')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='5' style={styles.item}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('My orders')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='6' style={styles.item} onPress={() => props.navigation.push('ReviewList')}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Restaurant reviews')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='7' style={styles.item} onPress={() => props.navigation.push('ProfileDelete')}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Delete profile')}</Text>
                    <Icon type='material' name='keyboard-arrow-right' size={25} color='#666666' />
                </TouchableOpacity>
                <TouchableOpacity key='8' style={styles.signout} onPress={() => onLogout()}>
                    <Text style={styles.itemText} numberOfLines={1}>{i18n.translate('Sign out')}</Text>
                </TouchableOpacity>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4'
    },
    itemText: {
        fontSize: 16,
        color: '#111111'
    },
    signout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60,
    },
});