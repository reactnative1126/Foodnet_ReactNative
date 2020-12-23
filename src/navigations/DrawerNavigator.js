import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Footer } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeStack from '@navigations/StackNavigators/HomeStackNavigator';
import ProfileStack from '@navigations/StackNavigators/ProfileStackNavigator';
import DeliveryStack from '@navigations/StackNavigators/DeliveryStackNavigator';
import OrderStack from '@navigations/StackNavigators/OrderStackNavigator';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { deleteUser } from '@modules/reducers/auth/actions';
import { setCartBadge } from '@modules/reducers/food/actions';
import { isEmpty, navOptionHandler } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { CartYellowIcon, OrderIcon, ProfileIcon, LocationIcon, LanguageIcon, ServiceIcon, GoBackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

const Drawer = createDrawerNavigator();
export default DrawerNavigator = () => {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />} drawerStyle={{ width: wp('100%') }}>
            <Drawer.Screen name="Home" component={HomeStack} options={navOptionHandler} />
            <Drawer.Screen name="Profile" component={ProfileStack} options={{
                headerShown: false,
                animationEnabled: false,
                swipeEnabled: false
            }} />
            <Drawer.Screen name="Delivery" component={DeliveryStack} options={{
                headerShown: false,
                animationEnabled: false,
                swipeEnabled: false
            }} />
            <Drawer.Screen name="Order" component={OrderStack} options={{
                headerShown: false,
                animationEnabled: false,
                swipeEnabled: false
            }} />
        </Drawer.Navigator>
    )
}

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const { logged, user } = useSelector(state => state.auth);
    const { cartBadge } = useSelector(state => state.food);

    const onLogout = () => {
        dispatch(deleteUser({
            token: null,
            email: user.email,
            name: user.name,
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
                    <TouchableOpacity onPress={() => {
                        dispatch(setCartBadge(0));
                        props.navigation.navigate('Order');
                    }}>
                        {cartBadge > 0 ? (
                            <Fragment>
                                <CartYellowIcon />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartBadge}</Text>
                                </View>
                            </Fragment>
                        ) : (
                                <Fragment>
                                    <CartYellowIcon />
                                    <View style={styles.badgeEmpty} />
                                </Fragment>
                            )}
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
                        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Profile')}>
                            <ProfileIcon />
                            <Text style={styles.menuTitle}>{i18n.translate('Profile')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Delivery')}>
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
    },
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FEEBD6',
        backgroundColor: colors.YELLOW.PRIMARY,
        marginTop: -30,
        marginLeft: 15
    },
    badgeEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 16,
        height: 16,
        marginTop: -30,
        marginLeft: 15
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.WHITE
    },
});