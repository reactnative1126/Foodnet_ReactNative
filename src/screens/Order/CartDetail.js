import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, SafeAreaView, FlatList, View, Text, Animated, Image, TouchableOpacity, LogBox } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartRestaurant, setCartProducts } from '@modules/reducers/food/actions';
import { ProfileService, FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { BackWhiteIcon, TrustIcon, SuccessIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import moment from 'moment';
import { TextField } from 'react-native-material-textfield';

const CartItem = ({ cartRestaurant, cartProduct, index, onSelect, onDelete }) => {
    const [count, setCount] = useState(cartProduct.quantity);
    return (
        <View key={index} style={styles.cart}>
            <View style={styles.cartMain}>
                <Text style={styles.cartText} numberOfLines={1}>{1}*{cartProduct.productName} - {cartProduct.quantity} {i18n.translate('people')}</Text>
                {/* <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => onDelete(false, cartProduct, count)}>
                    <TrustIcon />
                </TouchableOpacity> */}
            </View>
            <Text style={styles.allergen}>{i18n.translate('Allergens')}</Text>
            {!isEmpty(cartProduct.allergens) ? (
                <Text style={styles.allergenList}>({cartProduct.allergens.map((allergen, key) => (
                    <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != cartProduct.allergens.length - 1 ? ', ' : ''}</Text>
                ))})</Text>
            ) : null}
            {!isEmpty(cartProduct.extras) ? (
                <Text style={styles.extraList}>+{cartProduct.extras.map((extra, key) => (
                    <Text key={key} style={styles.extra}>{extra.quantity}*{extra.extraName}{key != cartProduct.extras.length - 1 ? ', ' : ''}</Text>
                ))}</Text>
            ) : null}
            <View style={styles.cartBottom}>
                <View style={styles.cartLeft}>
                    <Text style={styles.price}>{cartProduct.productPrice} Ft</Text>
                    {!isEmpty(cartProduct.boxPrice) && (
                        <Text style={styles.boxPrice}>{i18n.translate('Box price')}: {cartProduct.boxPrice}Ft</Text>
                    )}
                </View>
                {/* <View style={styles.cartButton}>
                    <TouchableOpacity style={styles.countButton1} disabled={count == 1} onPress={() => {
                        count > 1 && setCount(count - 1);
                        count > 1 && onSelect(true, cartProduct, count - 1);
                    }}>
                        <Icon type='material-community' name='minus' color='#333' size={25} />
                    </TouchableOpacity>
                    <View style={styles.count}>
                        <Text style={{ color: '#333' }}>{count} db</Text>
                    </View>
                    <TouchableOpacity style={styles.countButton2} onPress={() => {
                        setCount(count + 1);
                        onSelect(true, cartProduct, count + 1);
                    }}>
                        <Icon type='material-community' name='plus' color='#333' size={25} />
                    </TouchableOpacity>
                </View> */}
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

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default CartDetail = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts } = useSelector(state => state.food);

    const [success, setSuccess] = useState(false);
    const [restaurant] = useState(cartRestaurant);
    const [visible, setVisible] = useState(false);
    const [checkTemp, setCheckTemp] = useState(false);
    const [itemTemp, setItemTemp] = useState(null);
    const [countTemp, setCountTemp] = useState(0);
    const [total, setTotal] = useState(0);
    const [subscription, setSubscription] = useState(0);

    const [deliveryList, setDeliveryList] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState({ value: 0, label: '' });
    const [take, setTake] = useState(false);
    const [cutlery, setCutlery] = useState(false);
    const [comment, setComment] = useState('');
    const [payment, setPayment] = useState(1);

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
        outputRange: [HEADER_SCROLL_DISTANCE / 2 - 30, 5],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        const getDeliveryAddress = () => {
            dispatch(setLoading(true));
            ProfileService.getDeliveryList(user.token, country)
                .then((response) => {
                    dispatch(setLoading(false));
                    if (response.status == 200) {
                        setDeliveryList(response.result);
                        if (!isEmpty(response.result)) {
                            setDeliveryAddress({
                                value: response.result[0].id,
                                label: response.result[0].city + ', ' + response.result[0].street + ', ' + response.result[0].houseNumber
                            })
                        }
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                    console.log(error.message);
                });
        }
        logged && getDeliveryAddress();

        return () => console.log('Unmounted');
    }, []);

    useEffect(() => {
        var totalAmount = 0;
        var subAmount = 0;
        cartProducts.map((cartProduct, key) => {
            totalAmount += cartProduct.quantity * cartProduct.productPrice;
            cartProduct.extras.map((extra, key) => {
                subAmount += extra.quantity * extra.extraPrice;
            });
        });
        setTotal(totalAmount);
        setSubscription(subAmount);
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
            dispatch(setCartProducts(cartProducts));
        } else {
            var result = cartProducts.filter((cartProduct) => {
                return cartProduct.cartId != item.cartId
            });
            dispatch(setCartProducts(result));
        }
        setVisible(false);
    }

    const onOrder = () => {
        setVisible(false);
        dispatch(setLoading(true));
        FoodService.order(deliveryAddress.value, cartRestaurant.restaurant_id, take, cutlery, cartProducts)
            .then(async (response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setSuccess(true);
                    dispatch(setCartRestaurant(null));
                    dispatch(setCartProducts([]));
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
            });
    }

    return (
        <SafeAreaView style={styles.saveArea}>
            <Animated.ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
                {!success ? (
                    <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={[styles.cartText, { marginTop: 10 }]} numberOfLines={1}>{i18n.translate('Order complete')}</Text>
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
                            <Text style={styles.price}>{i18n.translate('Total')}: {total} Ft</Text>
                            <Text style={styles.subscription}>{i18n.translate('Subscription')}: {subscription} Ft</Text>
                        </View>
                        <Text style={[styles.cartText, { marginTop: 20 }]} numberOfLines={1}>{i18n.translate('Take over')}</Text>
                        {logged ? (
                            <View style={{ width: '100%' }}>
                                {deliveryList.map((delivery, key) => (
                                    <TouchableOpacity key={key} style={styles.radioButton} onPress={() => {
                                        setDeliveryAddress({
                                            value: delivery.id,
                                            label: delivery.city + ', ' + delivery.street + ', ' + delivery.houseNumber + ', ' + delivery.floor + ', ' + delivery.doorNumber
                                        })
                                    }}>
                                        <Icon type='material' name={delivery.id == deliveryAddress.value ? 'radio-button-on' : 'radio-button-off'} color={delivery.id == deliveryAddress.value ? colors.YELLOW.PRIMARY : colors.BLACK} size={20} />
                                        <Text style={styles.radioText} numberOfLines={1}>{delivery.city + ', ' + delivery.street + ', ' + delivery.houseNumber + ', ' + delivery.floor + ', ' + delivery.doorNumber}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                                <View style={{ width: '100%' }}>

                                </View>
                            )}
                        <View style={{ height: 20 }} />
                        <TouchableOpacity style={styles.radioButton} onPress={() => setTake(!take)}>
                            <Icon type='material' name={take ? 'check-box' : 'check-box-outline-blank'} color={take ? colors.YELLOW.PRIMARY : colors.BLACK} size={20} />
                            <Text style={styles.radioText} numberOfLines={1}>{i18n.translate('Take away')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.radioButton} onPress={() => setCutlery(!cutlery)}>
                            <Icon type='material' name={cutlery ? 'check-box' : 'check-box-outline-blank'} color={cutlery ? colors.YELLOW.PRIMARY : colors.BLACK} size={20} />
                            <Text style={styles.radioText} numberOfLines={1}>{i18n.translate('Without cutlery')}</Text>
                        </TouchableOpacity>

                        <Card key='review' style={styles.card}>
                            <View style={common.flexRow}>
                                <Text style={styles.labelText}>{i18n.translate('Comment')}</Text>
                            </View>
                            <TextField
                                keyboardType='default'
                                returnKeyType='next'
                                fontSize={16}
                                autoCorrect={false}
                                enablesReturnKeyAutomatically={true}
                                value={comment}
                                multiline={true}
                                height={85}
                                containerStyle={[styles.textContainer, common.borderColorGrey]}
                                inputContainerStyle={styles.inputContainer}
                                onChangeText={(value) => setComment(value)}
                            />
                        </Card>
                        <Text style={[styles.cartText, { marginTop: 20 }]} numberOfLines={1}>{i18n.translate('Payment method')}</Text>
                        <TouchableOpacity style={styles.radioButton} disabled={true}>
                            <Icon type='material' name={'radio-button-on'} color={colors.YELLOW.PRIMARY} size={20} />
                            <Text style={styles.radioText} numberOfLines={1}>{i18n.translate('Cash')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.radioButton} disabled={true}>
                            <Icon type='material' name={'radio-button-off'} color={colors.BLACK} size={20} />
                            <Text style={styles.radioText} numberOfLines={1}>{i18n.translate('Credit card')}</Text>
                        </TouchableOpacity>

                        <View style={{ marginTop: 30, marginBottom: 50, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                                <Text style={styles.buttonText}>{i18n.translate('Order Now')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                        <View style={styles.success}>
                            <View style={common.height50} />
                            <SuccessIcon />
                            <Text style={styles.iconText}>{i18n.translate('Congratulation')}</Text>
                            <Text style={styles.mainText}>{i18n.translate('Successful offer')}</Text>
                            <Text style={styles.mainDescription}>{i18n.translate('Your order will arrive soon We wish you a good appetite in advance')}</Text>
                            <TouchableOpacity style={styles.successButton} onPress={() => props.navigation.pop()}>
                                <Text style={styles.successText}>{i18n.translate('Order status')}</Text>
                            </TouchableOpacity>
                            <View style={common.height50} />
                        </View>
                    )}
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
                    <View style={common.headerRight} />
                </Header>
            </Animated.View>
            {visible && (
                <View style={styles.modalContainer}>
                    <View style={styles.overlay} />
                    <View style={styles.modalView}>
                        <View style={styles.modalMain}>
                            <Text style={styles.modalTitle}>{i18n.translate('Are you sure you want to delete the contents of your cart')}</Text>
                            <Text style={styles.modalDescription}>{i18n.translate('This operation cannot be undone')}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={() => onOrder()}>
                            <Text style={styles.saveText}>{i18n.translate('Order Now')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setVisible(false)}>
                            <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    },
    mainContainer: {
        width: wp('100%'),
        padding: 10
    },

    amount: {
        width: '100%',
        paddingTop: 20,
        paddingBottom: 20
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
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
        marginTop: 10,
        width: '100%',
        fontSize: 16,
        color: colors.BLACK
    },
    extra: {
        fontSize: 16,
        color: colors.BLACK
    },
    cartBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },
    cartLeft: {
        alignItems: 'flex-start'
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
    radioButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10
    },
    radioText: {
        fontSize: 16,
        marginLeft: 10,
    },
    card: {
        width: '100%',
        marginTop: 20
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    textContainer: {
        width: '100%',
        marginTop: 10,
        height: 120,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0,
        overflow: "scroll"
    },
    success: {
        width: '100%',
        alignItems: 'center',
        padding: 20
    },
    successButton: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 6,
        backgroundColor: '#FEEBD6'
    },
    successText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    iconText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#999999'
    },
    mainText: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F78F1E'
    },
    mainDescription: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#111'
    }
});