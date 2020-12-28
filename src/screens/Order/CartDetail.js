import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, SafeAreaView, ScrollView, FlatList, View, Text, Animated, Image, TouchableOpacity, LogBox } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartRestaurant, setCartProducts, setCartBadge } from '@modules/reducers/food/actions';
import { ProfileService, FoodService, AuthService } from '@modules/services';
import { isEmpty, validateBetween } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { BackWhiteIcon, TrustIcon, SuccessIcon, MapPinIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import moment from 'moment';
import { TextField } from 'react-native-material-textfield';

const CartItem = ({ cartRestaurant, cartProduct, index, onSelect, onDelete }) => {
    // const [count, setCount] = useState(cartProduct.quantity);
    return (
        <View key={`cart${index}`} style={styles.cart}>
            <View style={styles.cartMain}>
                <Text style={styles.cartText} numberOfLines={1}>{cartProduct.quantity}*{cartProduct.productName}</Text>
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => onDelete(false, cartProduct, cartProduct.quantity)}>
                    <TrustIcon />
                </TouchableOpacity>
            </View>
            <Text style={styles.allergen}>{cartProduct.productDescription}</Text>
            {!isEmpty(cartProduct.allergens) ? (
                <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {cartProduct.allergens.map((allergen, key) => (
                    <Text key={`allergen${key}`} style={styles.allergen}>{allergen.allergen_name}{key != cartProduct.allergens.length - 1 ? ', ' : ''}</Text>
                ))})</Text>
            ) : null}
            {!isEmpty(cartProduct.extras) ? (
                <Text style={styles.extraList}>+{cartProduct.extras.map((extra, key) => (
                    <Text key={`extra${key}`} style={styles.extra}>{extra.quantity}*{extra.extraName}{key != cartProduct.extras.length - 1 ? ', ' : ''}</Text>
                ))}</Text>
            ) : null}
            <View style={styles.cartBottom}>
                <View style={styles.cartLeft}>
                    <Text style={styles.price}>{cartProduct.productPrice.toFixed(2)} {i18n.translate('lei')}</Text>
                    {!isEmpty(cartProduct.boxPrice) && (
                        <Text style={styles.boxPrice}>{i18n.translate('Box price')}: {cartProduct.boxPrice}{i18n.translate('lei')}</Text>
                    )}
                </View>
                <View style={styles.cartButton}>
                    <TouchableOpacity style={styles.countButton1} disabled={cartProduct.quantity == 1} onPress={() => cartProduct.quantity > 1 && onSelect(true, cartProduct, cartProduct.quantity - 1)}>
                        <Icon type='material-community' name='minus' color='#333' size={25} />
                    </TouchableOpacity>
                    <View style={styles.count}>
                        <Text style={{ color: '#333' }}>{cartProduct.quantity} db</Text>
                    </View>
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

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default CartDetail = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts, cartBadge } = useSelector(state => state.food);

    const [success, setSuccess] = useState(false);
    const [restaurant] = useState(cartRestaurant);
    const [visible, setVisible] = useState(false);
    const [checkTemp, setCheckTemp] = useState(false);
    const [itemTemp, setItemTemp] = useState(null);
    const [countTemp, setCountTemp] = useState(0);
    const [total, setTotal] = useState(0);

    const [deliveryList, setDeliveryList] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState({ value: 0, label: '' });
    const [take, setTake] = useState(false);
    const [cutlery, setCutlery] = useState(false);
    const [comment, setComment] = useState('');
    const [payment, setPayment] = useState(1);

    const [addressId] = useState(0);
    const [errorCity, setErrorCity] = useState('');
    const [addressStreet, setAddressStreet] = useState('');
    const [visitStreet, setVisitStreet] = useState(false);
    const [errorStreet, setErrorStreet] = useState('');
    const [addressHouseNumber, setAddressHouseNumber] = useState('');
    const [visitHouseNumber, setVisitHouseNumber] = useState(false);
    const [errorHouseNumber, setErrorHouseNumber] = useState('');
    const [addressFloor, setAddressFloor] = useState('');
    const [addressDoorNumber, setAddressDoorNumber] = useState('');

    const [active, setActive] = useState(false);
    const [citys, setCitys] = useState([]);
    const [cityObj, setCityObj] = useState({ id: user.city.id, cities: user.city.name });

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
        getCities();

        return () => console.log('Unmounted');
    }, []);

    useEffect(() => {
        (visitStreet && isEmpty(addressStreet)) || (visitStreet && !validateBetween(addressStreet, 2, 100)) ? setErrorStreet('The text length must be between 2 ~ 100 characters') : setErrorStreet('');
        (visitHouseNumber && isEmpty(addressHouseNumber)) || (visitHouseNumber && !validateBetween(addressHouseNumber, 1, 20)) ? setErrorHouseNumber('The text must be less more than 20 characters') : setErrorHouseNumber('');
    }, [addressStreet, visitStreet, addressHouseNumber, visitHouseNumber]);

    useEffect(() => {
        var totalAmount = 0;
        cartProducts.map((cartProduct, key) => {
            totalAmount += cartProduct.quantity * cartProduct.productPrice;
            cartProduct.extras.map((extra, key) => {
                totalAmount += extra.quantity * extra.extraPrice;
            });
        });
        setTotal(totalAmount);
    });

    const onDelete = (check, item, count) => {
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
            dispatch(setCartProducts(cartProducts));
            dispatch(setCartBadge(totalBadge));
        } else {
            var result = cartProducts.filter((cartProduct) => {
                return cartProduct.cartId != item.cartId
            });
            var totalBadge = 0;
            result.map((cartProduct, key) => {
                totalBadge += cartProduct.quantity;
            });
            dispatch(setCartProducts(result));
            dispatch(setCartBadge(totalBadge));
            // dispatch(setCartBadge(cartBadge - 1));
            if (totalBadge <= 0) props.navigation.pop();
        }
        setVisible(false);
    }

    const onOrder = () => {
        if (!logged || isEmpty(deliveryList)) {
            if (cityObj.id == 0 || isEmpty(addressStreet) || isEmpty(addressHouseNumber) || errorStreet || errorHouseNumber) {
                alert('Please enter required field');
            } else {
                dispatch(setLoading(true));
                ProfileService.setDeliveryAddress(user.token, addressId, cityObj, addressStreet, addressHouseNumber, addressFloor, addressDoorNumber)
                    .then((response) => {
                        if (response.status == 201 || response.status == 200) {
                            FoodService.order(user.token, response.result.id, cartRestaurant.restaurant_id, take, cutlery, cartProducts)
                                .then((resp) => {
                                    dispatch(setLoading(false));
                                    if (resp.status == 200) {
                                        setSuccess(true);
                                        // dispatch(setCartRestaurant(null));
                                        dispatch(setCartBadge(0));
                                        dispatch(setCartProducts([]));
                                    }
                                })
                                .catch((error) => {
                                    dispatch(setLoading(false));
                                });
                        }
                    })
                    .catch((error) => {
                        dispatch(setLoading(false));
                    });
            }
        } else {
            FoodService.order(user.token, deliveryAddress.value, cartRestaurant.restaurant_id, take, cutlery, cartProducts)
                .then((resp) => {
                    dispatch(setLoading(false));
                    if (resp.status == 200) {
                        setSuccess(true);
                        // dispatch(setCartRestaurant(null));
                        dispatch(setCartBadge(0));
                        dispatch(setCartProducts([]));
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
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
                            <Text style={styles.price}>{i18n.translate('Total')}: {total.toFixed(2)} {i18n.translate('lei')}</Text>
                        </View>
                        <Text style={[styles.cartText, { marginTop: 20 }]} numberOfLines={1}>{i18n.translate('Take over')}</Text>
                        {logged && !isEmpty(deliveryList) ? (
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
                                <View style={styles.content1}>
                                    <View style={styles.selectView1}>
                                        <View style={common.flexRow}>
                                            <Text style={[styles.labelText1, !isEmpty(errorCity) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Settlement')}</Text>
                                            <Text style={[styles.labelTextNormal1, !isEmpty(errorCity) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.selectContainer1, !isEmpty(errorCity) ? common.borderColorRed : common.borderColorGrey]} onPress={() => setActive(!active)}>
                                            <MapPinIcon />
                                            <Text style={styles.itemText1} numberOfLines={1}>{cityObj.cities}</Text>
                                            <Icon type='material' name='keyboard-arrow-down' size={30} color={colors.GREY.PRIMARY} />
                                        </TouchableOpacity>
                                        {/* <Text style={common.errorText}>{errorCity}</Text> */}
                                    </View>
                                    {active ? (
                                        <ScrollView style={styles.listView1}>
                                            {!isEmpty(citys) && citys.map((cityOne, key) => (
                                                <TouchableOpacity key={key} style={[styles.itemView1, key == citys.length - 1 && styles.noborder1]} onPress={() => {
                                                    setActive(false);
                                                    setCityObj(cityOne);
                                                }}>
                                                    <Text style={styles.itemText1} numberOfLines={1}>{cityOne.cities}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    ) : (
                                            <Fragment>
                                                <View style={styles.streetView1}>
                                                    <View style={common.flexRow}>
                                                        <Text style={[styles.labelText1, !isEmpty(errorStreet) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Street')}</Text>
                                                        <Text style={[styles.labelTextNormal1, !isEmpty(errorStreet) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                                                    </View>
                                                    <TextField
                                                        keyboardType='default'
                                                        returnKeyType='next'
                                                        fontSize={16}
                                                        autoCorrect={false}
                                                        enablesReturnKeyAutomatically={true}
                                                        value={addressStreet}
                                                        containerStyle={[styles.textContainer1, !isEmpty(errorStreet) ? common.borderColorRed : common.borderColorGrey]}
                                                        inputContainerStyle={styles.inputContainer1}
                                                        onChangeText={(value) => {
                                                            setAddressStreet(value);
                                                            setVisitStreet(true);
                                                        }}
                                                    />
                                                    <Text style={common.errorText}>{errorStreet}</Text>
                                                </View>
                                                <View style={styles.threeView1}>
                                                    <View style={styles.inputView1}>
                                                        <Text style={[styles.labelText1, !isEmpty(errorHouseNumber) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('House number')}</Text>
                                                        <Text style={[styles.labelTextNormal1, !isEmpty(errorHouseNumber) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                                                        <TextField
                                                            keyboardType='default'
                                                            returnKeyType='next'
                                                            fontSize={16}
                                                            autoCorrect={false}
                                                            enablesReturnKeyAutomatically={true}
                                                            value={addressHouseNumber}
                                                            containerStyle={[styles.textContainer1, !isEmpty(errorHouseNumber) ? common.borderColorRed : common.borderColorGrey]}
                                                            inputContainerStyle={styles.inputContainer1}
                                                            onChangeText={(value) => {
                                                                setAddressHouseNumber(value);
                                                                setVisitHouseNumber(true);
                                                            }}
                                                        />
                                                        <Text style={common.errorText}>{errorHouseNumber}</Text>
                                                    </View>
                                                    <View style={styles.inputView1}>
                                                        <Text style={[styles.labelText1, common.fontColorBlack]}>{i18n.translate('Floor')}</Text>
                                                        <Text style={[styles.labelTextNormal1, common.fontColorBlack]}> ({i18n.translate('Optional')})</Text>
                                                        <TextField
                                                            keyboardType='default'
                                                            returnKeyType='next'
                                                            fontSize={16}
                                                            autoCorrect={false}
                                                            enablesReturnKeyAutomatically={true}
                                                            value={addressFloor}
                                                            containerStyle={[styles.textContainer1, common.borderColorGrey]}
                                                            inputContainerStyle={styles.inputContainer1}
                                                            onChangeText={(value) => {
                                                                setAddressFloor(value);
                                                            }}
                                                        />
                                                    </View>
                                                    <View style={styles.inputView1}>
                                                        <Text style={[styles.labelText1, common.fontColorBlack]}>{i18n.translate('Door')}</Text>
                                                        <Text style={[styles.labelTextNormal1, common.fontColorBlack]}> ({i18n.translate('Optional')})</Text>
                                                        <TextField
                                                            keyboardType='default'
                                                            fontSize={16}
                                                            autoCorrect={false}
                                                            enablesReturnKeyAutomatically={true}
                                                            value={addressDoorNumber}
                                                            containerStyle={[styles.textContainer1, common.borderColorGrey]}
                                                            inputContainerStyle={styles.inputContainer1}
                                                            onChangeText={(value) => {
                                                                setAddressDoorNumber(value);
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </Fragment>
                                        )}
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
                        {/* <TouchableOpacity style={styles.radioButton} disabled={true}>
                            <Icon type='material' name={'radio-button-off'} color={colors.BLACK} size={20} />
                            <Text style={styles.radioText} numberOfLines={1}>{i18n.translate('Credit card')}</Text>
                        </TouchableOpacity> */}

                        <View style={{ marginTop: 30, marginBottom: 50, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => onOrder()}>
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
                        <TouchableOpacity style={styles.modalButton} onPress={() => onSelect(checkTemp, itemTemp, countTemp)}>
                            <Text style={styles.saveText}>{i18n.translate('Delete')}</Text>
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
    },


    content1: {
        width: '100%'
    },
    selectView1: {
        marginTop: 20,
        width: '100%'
    },
    selectContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 10,
        borderColor: colors.GREY.PRIMARY
    },
    streetView1: {
        marginTop: 40,
        width: '100%'
    },
    threeView1: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    inputView1: {
        width: '30%'
    },
    textContainer1: {
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    inputContainer1: {
        marginTop: -20,
        borderWidth: 0
    },
    itemText1: {
        width: '75%',
        fontSize: 16,
        textAlign: 'left',
    },
    listView1: {
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
    itemView1: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.GREY.PRIMARY
    },
    noborder1: {
        borderBottomWidth: 0
    },
    labelText1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    labelTextNormal1: {
        fontSize: 16,
        color: colors.BLACK
    },
});