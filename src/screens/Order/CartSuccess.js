import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, SafeAreaView, FlatList, View, Text, Animated, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCart, setBadge } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { BackWhiteIcon, CartYellowIcon, CartWhiteIcon, CheckIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import moment from 'moment';

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default CartSuccess = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { filters, cart, badge, toast } = useSelector(state => state.food);

    const [restaurant, setRestaurant] = useState(cart[0].restaurant);

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });
    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });
    const headerBottomTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, HEADER_MAX_HEIGHT],
        extrapolate: 'clamp',
    });
    const headerTopTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, 0],
        extrapolate: 'clamp',
    });
    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_SCROLL_DISTANCE / 2 - 30, 20],
        extrapolate: 'clamp',
    });
    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0],
        extrapolate: 'clamp',
    });

    return (
        <SafeAreaView style={styles.saveArea}>
            <Animated.ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
                
                <View style={{ height: 50 }} />
            </Animated.ScrollView>

            <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                <Animated.Image style={[styles.headerBackground, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: RES_URL + restaurant.restaurant_coverImage }} />
                <Animated.View style={[styles.headerBottom, { transform: [{ translateY: headerBottomTranslateY }] }]}>
                    <View style={styles.avatar}>
                        <Image style={styles.avatarView} source={{ uri: RES_URL + restaurant.restaurant_profileImage }} resizeMode="contain" />
                    </View>
                    <View>
                        <View style={styles.statusView}>
                            <View style={[styles.statusItem, (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(restaurant.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(restaurant.restaurant_close.replace(':', ''))) ? styles.statusRed : styles.statusGreen]}>
                                <Text style={styles.statusText}>{(parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(restaurant.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(restaurant.restaurant_close.replace(':', ''))) ? i18n.translate('CLOSED') : i18n.translate('OPEN')}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
            <Animated.View style={[styles.headerTop, { transform: [{ translateY: headerTopTranslateY }] }]}>
                <Header style={styles.headerContent}>
                    <View style={common.headerLeft}>
                        <TouchableOpacity onPress={() => props.navigation.pop()}>
                            <BackWhiteIcon />
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={[{ transform: [{ translateY: titleTranslateY }] }]}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{restaurant.restaurant_name}</Text>
                    </Animated.View>
                    <View style={common.headerRight}>
                        <TouchableOpacity onPress={() => {
                            dispatch(setBadge(0));
                            props.navigation.navigate('Order');
                        }}>
                            {badge > 0 ? (
                                <Fragment>
                                    <CartYellowIcon />
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{badge}</Text>
                                    </View>
                                </Fragment>
                            ) : (
                                    <Fragment>
                                        <CartWhiteIcon />
                                        <View style={styles.badgeEmpty} />
                                    </Fragment>
                                )}
                        </TouchableOpacity>
                    </View>
                </Header>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    saveArea: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00000080',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
        marginTop: 0
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    headerContent: {
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        paddingHorizontal: 10,
        elevation: 0
    },
    headerTop: {
        marginTop: Platform.OS === 'ios' ? 40 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerTitle: {
        width: wp('60%'),
        height: 25,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.WHITE,
        textAlign: 'center'
    },
    headerBottom: {
        top: HEADER_MAX_HEIGHT - 50,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('100%'),
        backgroundColor: colors.WHITE
    },
    avatar: {
        marginTop: -55,
        marginLeft: 16,
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        borderWidth: 5,
        borderColor: colors.WHITE,
        backgroundColor: '#C4C4C4',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarView: {
        height: 90,
        width: 90,
    },
    statusView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: -55,
        marginLeft: 20
    },
    statusItem: {
        marginRight: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: '#FEEBD6',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.WHITE,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    statusGreen: {
        backgroundColor: '#4ACC4F'
    },
    statusRed: {
        backgroundColor: '#F05050'
    },
    content: {
        paddingTop: HEADER_MAX_HEIGHT - 32
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
    toast: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom: 0,
        paddingLeft: 50,
        width: wp('100%'),
        height: 60,
        backgroundColor: '#FEEBD6',
        shadowColor: colors.BLACK,
        shadowOffset: { width: 4, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10
    },
    toastText: {
        marginLeft: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F78F1E'
    }
});