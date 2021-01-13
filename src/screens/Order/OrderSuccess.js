import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Content, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { CartYellowIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import FastImage from 'react-native-fast-image';

const OrderItem = ({ orderItem, index }) => {
    console.log(JSON.stringify(orderItem))
    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <FastImage style={styles.productImage} source={{ uri: RES_URL + orderItem.item.product_imageUrl }} resizeMode='cover' />
            <View key={`order${index}`} style={styles.cart}>
                <View style={styles.cartMain}>
                    <Text style={styles.cartText} numberOfLines={1}>{orderItem.item.product_quantity}*{orderItem.item.product_name}</Text>
                </View>
                <Text style={styles.allergen} numberOfLines={1}>{orderItem.item.product_description}</Text>
                {!isEmpty(orderItem.item.allergenName) ? (
                    <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {orderItem.item.allergenName.map((allergen, key) => (
                        <Text key={`allergen${key}`} style={styles.allergen}>{allergen}{key != orderItem.item.allergenName.length - 1 ? ', ' : ''}</Text>
                    ))})</Text>
                ) : null}
                {!isEmpty(orderItem.item.extras) ? (
                    <Text style={styles.extraList}>+ {orderItem.item.extras.map((extra, key) => (
                        <Text key={`extra${key}`} style={styles.extra}>{extra.extra_quantity}*{extra.extra_name}{key != orderItem.item.extras.length - 1 ? ', ' : ''}</Text>
                    ))}</Text>
                ) : null}
                <View style={styles.cartBottom}>
                    <View style={styles.cartLeft}>
                        <Text style={styles.price}>{orderItem.item.total_product_price} {i18n.translate('lei')}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default OrderSuccess = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts, cartBadge } = useSelector(state => state.food);

    const [order, setOrder] = useState(props.route.params.order);

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('App', { screen: 'Order' })}>
                        <Icon type='material' name='arrow-back' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle}>
                    <Text style={common.headerTitleText} numberOfLines={1}>{i18n.translate('Order Detail')}</Text>
                </TouchableOpacity>
                <View style={common.headerRight}>
                    <TouchableOpacity>
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
            <Content style={{ flex: 1, padding: 20 }}>
                <View style={{ width: wp('100%'), marginLeft: -20, borderBottomWidth: 0.7, borderBottomColor: colors.GREY.PRIMARY }}>
                    <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 16, color: '#111' }}>{i18n.translate('Order ID')}:</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 5 }}>{order.orderId}</Text>
                        <Text style={{ fontSize: 16, color: '#111', marginTop: 20 }}>{i18n.translate('Order placed')}:</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 5 }}>{order.orderCreatedAt}</Text>
                        <Text style={{ fontSize: 16, color: '#111', marginTop: 20 }}>{i18n.translate('Place and method of collection')}:</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 5 }}>
                            {!isEmpty(order.deliveryAddress) && order.deliveryAddress[0].door_number}{' '}
                            {!isEmpty(order.deliveryAddress) && order.deliveryAddress[0].floor}{' '}
                            {!isEmpty(order.deliveryAddress) && order.deliveryAddress[0].house_number}{', '}
                            {!isEmpty(order.deliveryAddress) && order.deliveryAddress[0].street}{', '}
                            {!isEmpty(order.deliveryAddress) && order.deliveryAddress[0].city}
                        </Text>
                    </View>
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 20, marginBottom: 20 }}>{i18n.translate('Food (s) ordered')}</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={order.result}
                    keyExtractor={(orderItem, index) => index.toString()}
                    renderItem={(orderItem, index) => (
                        <OrderItem
                            index={index}
                            orderItem={orderItem} />
                    )}
                />
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    descriptionText: {
        width: '100%',
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
        lineHeight: 24,
        marginBottom: 10
    },
    productImage: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: 10
    },
    cart: {
        width: '65%',
        paddingBottom: 10,
        // borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4'
    },
    cartMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // height: 30,
        // marginTop: 15,
        marginBottom: 10
    },
    cartText: {
        width: '70%',
        fontSize: 16,
        lineHeight: 24,
        color: '#111',
        fontWeight: 'bold'
    },
    allergenList: {
        marginTop: 5,
        width: '100%',
        fontSize: 16,
        color: '#999'
    },
    allergen: {
        fontSize: 16,
        color: '#999'
    },
    extraList: {
        marginTop: 15,
        width: '100%',
        fontSize: 16,
        color: colors.BLACK
    },
    extra: {
        fontSize: 16,
        color: colors.BLACK
    },
    cartBottom: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },
    cartLeft: {
        alignItems: 'flex-start'
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    boxPrice: {
        fontSize: 12,
        color: '#999'
    },

    cartButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    count: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 30,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#C4C4C4'
    },
    countButton1: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#C4C4C4'
    },
    countButton2: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        borderWidth: 1,
        borderColor: '#C4C4C4'
    },
    comment: {
        fontSize: 16,
        color: '#111'
    },
    commentText: {
        fontSize: 16,
        color: '#666'
    },
    amount: {
        width: '100%',
        paddingTop: 20,
        paddingBottom: 20
    },
    subscription: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6D6D6D'
    },
    button: {
        marginBottom: 20,
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.YELLOW.PRIMARY
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    emptyView: {
        width: '100%',
        alignItems: 'center',
        marginTop: 100,
        padding: 20
    },
    emptyText1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    emptyText2: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
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
        backgroundColor: '#1E1E1E',
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
        borderTopColor: colors.BLACK
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