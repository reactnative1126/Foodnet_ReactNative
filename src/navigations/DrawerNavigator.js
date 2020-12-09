import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Footer } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeStack from '@navigations/StackNavigators/HomeStackNavigator';
import ProfileStack from '@navigations/StackNavigators/ProfileStackNavigator';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { deleteUser } from '@modules/reducers/auth/actions';
import { isEmpty, navOptionHandler } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { InboxIcon, OrderIcon, ProfileIcon, CouponIcon, LocationIcon, LanguageIcon, ServiceIcon, GoBackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

const Drawer = createDrawerNavigator();
export default DrawerNavigator = () => {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />} drawerStyle={{ width: wp('100%') }}>
            <Drawer.Screen name="Home" component={HomeStack} options={navOptionHandler} />
            <Drawer.Screen name="Profile" component={ProfileStack} options={navOptionHandler} />
        </Drawer.Navigator>
    )
}

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const { logged, user } = useSelector(state => state.auth);

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
    return (
        <Container style={styles.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                        <Icon type='ionicon' name='ios-close' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Home')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => alert('Inbox')}>
                        <InboxIcon />
                    </TouchableOpacity>
                </View>
            </Header>
            <Content style={styles.content}>
                {logged && (
                    <Fragment>
                        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Home')}>
                            <OrderIcon />
                            <Text style={styles.menuTitle}>{i18n.translate('My orders')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            console.log(user.token);
                            props.navigation.navigate('Profile');
                        }}>
                            <ProfileIcon />
                            <Text style={styles.menuTitle}>{i18n.translate('Profile')}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.menuItem}>
                            <CouponIcon />
                            <Text style={styles.menuTitle}>{i18n.translate('Coupon codes')}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Profile', { screen: 'DeliveryList' })}>
                            <LocationIcon />
                            <Text style={styles.menuTitle}>{i18n.translate('My addresses')}</Text>
                        </TouchableOpacity>
                    </Fragment>
                )}
                <TouchableOpacity style={styles.menuItem} onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.push('Languages');
                }}>
                    <LanguageIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('Language selector')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <ServiceIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('Customer service')}</Text>
                </TouchableOpacity>
            </Content>
            {logged ? (
                <Footer style={styles.header}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => onLogout()}>
                        <Icon type='material-community' name='logout-variant' size={25} color={colors.YELLOW.PRIMARY} />
                        <Text style={styles.menuTitle}>{i18n.translate('Log out')}</Text>
                    </TouchableOpacity>
                </Footer>
            ) : (
                    <Footer style={styles.header}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => onLogout()}>
                            <GoBackIcon />
                            <Text style={styles.menuTitle}>{i18n.translate('Back to the login')}</Text>
                        </TouchableOpacity>
                    </Footer>
                )}
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%')
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    backIcon: {
        width: 25,
        height: 25
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    content: {
        paddingTop: 20
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    menuTitle: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '400',
        color: '#111'
    }
});