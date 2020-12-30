import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Content, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartProducts, setCartBadge } from '@modules/reducers/food/actions';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { TrustIcon, CartYellowIcon, CartWhiteIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

const CartItem = ({ cartRestaurant, cartProduct, index, onSelect, onDelete }) => {
    return (
        <View key={`cart${index}`} style={styles.cart}>
            <View style={styles.cartMain}>
                <Text style={styles.cartText} numberOfLines={1}>{cartProduct.quantity}*{cartProduct.productName}</Text>
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => onDelete(false, cartProduct, cartProduct.quantity)}>
                    <TrustIcon />
                </TouchableOpacity>
            </View>
            <Text style={styles.allergen} numberOfLines={1}>{cartProduct.productDescription}</Text>
            {!isEmpty(cartProduct.allergens) ? (
                <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {cartProduct.allergens.map((allergen, key) => (
                    <Text key={`allergen${key}`} style={styles.allergen}>{allergen.allergen_name}{key != cartProduct.allergens.length - 1 ? ', ' : ''}</Text>
                ))})</Text>
            ) : null}
            {!isEmpty(cartProduct.extras) ? (
                <Text style={styles.extraList}>+ {cartProduct.extras.map((extra, key) => (
                    <Text key={`extra${key}`} style={styles.extra}>{extra.quantity}*{extra.extraName}{key != cartProduct.extras.length - 1 ? ', ' : ''}</Text>
                ))}</Text>
            ) : null}
            <View style={styles.cartBottom}>
                <View style={styles.cartLeft}>
                    <Text style={styles.price}>{cartProduct.productPrice} {i18n.translate('lei')}</Text>
                    {!isEmpty(cartProduct.boxPrice) && (
                        <Text style={styles.boxPrice}>{i18n.translate('Box price')}: {cartProduct.boxPrice.toFixed(2)}{i18n.translate('lei')}</Text>
                    )}
                </View>
                <View style={styles.cartButton}>
                    <TouchableOpacity style={styles.countButton1} disabled={cartProduct.quantity == 1} onPress={() => cartProduct.quantity > 1 && onSelect(true, cartProduct, cartProduct.quantity - 1)}>
                        <Icon type='material-community' name='minus' color='#333' size={25} />
                    </TouchableOpacity>
                    <View style={styles.count}><Text style={{ color: '#333' }}>{cartProduct.quantity} db</Text></View>
                    <TouchableOpacity style={styles.countButton2} onPress={() => onSelect(true, cartProduct, cartProduct.quantity + 1)}>
                        <Icon type='material-community' name='plus' color='#333' size={25} />
                    </TouchableOpacity>
                </View>
            </View>
            {!isEmpty(cartProduct.message) ? (
                <Fragment>
                    <Text style={styles.comment}>{i18n.translate('Comment')}:</Text>
                    <Text style={styles.commentText}>{cartProduct.message}</Text>
                </Fragment>
            ) : null}
        </View>
    )
}

export default Cart = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts, cartBadge } = useSelector(state => state.food);

    const [visible, setVisible] = useState(false);
    const [type, setType] = useState(false);
    const [checkTemp, setCheckTemp] = useState(false);
    const [itemTemp, setItemTemp] = useState(null);
    const [countTemp, setCountTemp] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        var totalAmount = 0;
        cartProducts.map((cartProduct, key) => {
            totalAmount += cartProduct.quantity * cartProduct.productPrice;
            if (cartProduct.boxPrice) totalAmount += cartProduct.quantity * cartProduct.boxPrice;
            cartProduct.extras.map((extra, key) => {
                totalAmount += extra.quantity * extra.extraPrice;
            });
        });
        setTotal(totalAmount);
    });

    const onDelete = (check, item, count) => {
        setType(false);
        setCheckTemp(check);
        setItemTemp(item);
        setCountTemp(count);
        setVisible(true);
    };

    const onSelect = (check, item, count) => {
        if (check) {
            var index = cartProducts.findIndex((cartProduct) => {
                return cartProduct.cartId == item.cartId
            });
            cartProducts[index].quantity = count;
            var totalBadge = 0;
            cartProducts.map((cartProduct, key) => {
                totalBadge += cartProduct.quantity;
            });
            dispatch(setCartBadge(totalBadge));
            dispatch(setCartProducts(cartProducts));
        } else {
            var result = cartProducts.filter((cartProduct) => {
                return cartProduct.cartId != item.cartId
            });
            var totalBadge = 0;
            result.map((cartProduct, key) => {
                totalBadge += cartProduct.quantity;
            });
            dispatch(setCartBadge(totalBadge));
            dispatch(setCartProducts(result));
            // dispatch(setCartBadge(cartBadge - 1));
        }
        setVisible(false);
    }

    const onEmpty = () => {
        dispatch(setCartBadge(0));
        dispatch(setCartProducts([]));
        setVisible(false);
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
                    <Text style={common.headerTitleText} numberOfLines={1}>{i18n.translate('Basket')}</Text>
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
                {!isEmpty(cartProducts) ? (
                    <Fragment>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={cartProducts}
                            keyExtractor={(cartProduct, index) => index.toString()}
                            renderItem={(cartProduct, index) => (
                                <CartItem
                                    cartRestaurant={cartRestaurant}
                                    cartProduct={cartProduct.item}
                                    onSelect={(check, item, count) => onSelect(check, item, count)}
                                    onDelete={(check, item, count) => onDelete(check, item, count)}
                                />
                            )}
                        />
                        <View style={styles.amount}>
                            <Text style={styles.price}>{i18n.translate('Total')}: {total.toFixed(2)} {i18n.translate('lei')}</Text>
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 50, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => props.navigation.push('CartDetail')}>
                                <Text style={styles.buttonText}>{i18n.translate('Send order')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setType(true);
                                setVisible(true);
                            }}>
                                <Text style={styles.price}>{i18n.translate('Delete cart items')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                ) : (
                        <View style={styles.emptyView}>
                            <Text style={styles.emptyText1}>{i18n.translate('Your cart is currently empty')}</Text>
                            <Text style={styles.emptyText2}>{i18n.translate('But tomorrow versatile and mass I hate football and a valuable asset to free macro as an integer')}</Text>
                            <TouchableOpacity style={[common.button, common.backColorYellow, common.marginTop35]} onPress={() => props.navigation.goBack()}>
                                <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Look around')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </Content>
            {visible && (
                <View style={styles.modalContainer}>
                    <View style={styles.overlay} />
                    <View style={styles.modalView}>
                        <View style={styles.modalMain}>
                            <Text style={styles.modalTitle}>{i18n.translate('Are you sure you want to delete the contents of your cart')}</Text>
                            <Text style={styles.modalDescription}>{i18n.translate('This operation cannot be undone')}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            !type ? onSelect(checkTemp, itemTemp, countTemp) : onEmpty()
                        }}>
                            <Text style={styles.saveText}>{i18n.translate('Delete')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setVisible(false)}>
                            <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    cart: {
        width: '100%',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4'
    },
    cartMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // height: 30,
        marginTop: 15,
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