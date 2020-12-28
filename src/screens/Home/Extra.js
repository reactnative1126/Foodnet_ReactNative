import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Content, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartRestaurant, setCartProducts, setCartBadge, setCartToast } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

const Required = ({ required, index, onSelect }) => {
    const [check, setCheck] = useState(false);
    const [count, setCount] = useState(required.extra_minQuantity);
    return (
        <Fragment>
            <TouchableOpacity key={index} style={styles.items} onPress={() => {
                setCheck(!check);
                onSelect(!check, required, count);
            }}>
                <View style={styles.check}>
                    <Icon type='material-community' name={check ? 'check-box-outline' : 'checkbox-blank-outline'} size={25} color={check ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY} />
                </View>
                <View style={styles.item}>
                    <Text style={{ fontSize: 16 }} numberOfLines={1}>{required.extra_name}</Text>
                    {!isEmpty(required.allergens_name) ? (
                        <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {required.allergens_name.map((allergen, key) => (
                            <Text key={`allergen${key}`} style={styles.allergen}>{allergen.allergen}{key != required.allergens_name.length - 1 ? ', ' : ''}</Text>
                        ))})</Text>
                    ) : null}
                </View>
            </TouchableOpacity>
            <View style={styles.items}>
                <View style={styles.check} />
                <View style={styles.item}>
                    <View style={styles.productCart}>
                        <Text style={styles.price}>{required.extra_price.toFixed(2) * count} {i18n.translate('lei')}</Text>
                        <View style={styles.cart}>
                            <TouchableOpacity style={styles.countButton1} disabled={!check} onPress={() => {
                                count > required.extra_minQuantity && setCount(count - 1);
                                count > required.extra_minQuantity && onSelect(check, required, count - 1);
                            }}>
                                <Icon type='material-community' name='minus' color='#333' size={25} />
                            </TouchableOpacity>
                            <View style={styles.count}>
                                <Text style={{ color: '#333' }}>{count} db</Text>
                            </View>
                            <TouchableOpacity style={styles.countButton2} disabled={!check} onPress={() => {
                                count < required.extra_maxQuantity && setCount(count + 1);
                                count < required.extra_maxQuantity && onSelect(check, required, count + 1);
                            }}>
                                <Icon type='material-community' name='plus' color='#333' size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Fragment>
    )
}

const Optional = ({ optional, index, onSelect }) => {
    const [check, setCheck] = useState(false);
    const [count, setCount] = useState(optional.extra_minQuantity);
    return (
        <Fragment>
            <TouchableOpacity key={index} style={styles.items} onPress={() => {
                setCheck(!check);
                onSelect(!check, optional, count);
            }}>
                <View style={styles.check}>
                    <Icon type='material-community' name={check ? 'check-box-outline' : 'checkbox-blank-outline'} size={25} color={check ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY} />
                </View>
                <View style={styles.item}>
                    <Text style={{ fontSize: 16 }} numberOfLines={1}>{optional.extra_name}</Text>
                    {!isEmpty(optional.allergens_name) ? (
                        <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {optional.allergens_name.map((allergen, key) => (
                            <Text key={`allergensop${key}`} style={styles.allergen}>{allergen.allergen}{key != optional.allergens_name.length - 1 ? ', ' : ''}</Text>
                        ))})</Text>
                    ) : null}
                </View>
            </TouchableOpacity>
            <View style={styles.items}>
                <View style={styles.check} />
                <View style={styles.item}>
                    <View style={styles.productCart}>
                        <Text style={styles.price}>{optional.extra_price.toFixed(2) * count} {i18n.translate('lei')}</Text>
                        <View style={styles.cart}>
                            <TouchableOpacity style={styles.countButton1} disabled={!check} onPress={() => {
                                count > optional.extra_minQuantity && setCount(count - 1);
                                count > optional.extra_minQuantity && onSelect(check, optional, count - 1);
                            }}>
                                <Icon type='material-community' name='minus' color='#333' size={25} />
                            </TouchableOpacity>
                            <View style={styles.count}>
                                <Text style={{ color: '#333' }}>{count} db</Text>
                            </View>
                            <TouchableOpacity style={styles.countButton2} disabled={!check} onPress={() => {
                                count < optional.extra_maxQuantity && setCount(count + 1);
                                count < optional.extra_maxQuantity && onSelect(check, optional, count + 1);
                            }}>
                                <Icon type='material-community' name='plus' color='#333' size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Fragment>
    )
}

export default Extra = (props) => {
    const dispatch = useDispatch();
    const { country } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts, cartBadge, cartToast } = useSelector(state => state.food);

    const [restaurant] = useState(props.route.params.restaurant);
    const [product] = useState(props.route.params.product);
    const [quantity] = useState(props.route.params.count);
    const [minRequired, setMinRequired] = useState(0);
    const [requireds, setRequireds] = useState([]);
    const [requiredList, setRequiredList] = useState([]);
    const [optionals, setOptionals] = useState([]);
    const [optionalList, setOptionalList] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const getRequired = () => {
            dispatch(setLoading(true));
            FoodService.required(country, restaurant.restaurant_id, product.variant_id)
                .then((response) => {
                    // dispatch(setLoading(false));
                    if (response.status == 200) {
                        setMinRequired(response.minRequired);
                        setRequireds(response.result);
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
        getRequired();

        const getOptional = () => {
            FoodService.optional(country, restaurant.restaurant_id, product.variant_id)
                .then((response) => {
                    dispatch(setLoading(false));
                    if (response.status == 200) {
                        setOptionals(response.result);
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
        getOptional();

    }, []);

    const onSelect = (type, check, item, count) => {
        if (type == 1) {
            var requiredResult = requiredList.filter((required) => {
                return required.extra_id != item.extra_id
            });
            if (check) {
                setRequiredList([...requiredResult, {
                    extra_id: item.extra_id,
                    extra_name: item.extra_name,
                    extra_minQuantity: item.extra_minQuantity,
                    extra_price: item.extra_price,
                    extra_maxQuantity: item.extra_maxQuantity,
                    allergens_name: item.allergens_name,
                    extra_dash: count
                }]);
            } else {
                setRequiredList(requiredResult);
            }
        } else {
            var optionalResult = optionalList.filter((optional) => {
                return optional.extra_id != item.extra_id
            });
            if (check) {
                setOptionalList([...optionalResult, {
                    extra_id: item.extra_id,
                    extra_name: item.extra_name,
                    extra_minQuantity: item.extra_minQuantity,
                    extra_price: item.extra_price,
                    extra_maxQuantity: item.extra_maxQuantity,
                    allergens_name: item.allergens_name,
                    extra_dash: count
                }]);
            } else {
                setOptionalList(optionalResult);
            }
        }
    }

    const onAdd = () => {
        if (minRequired <= requiredList.length) {

            var extras = [];
            requiredList.map((required, key) => {
                extras.push({
                    id: required.extra_id,
                    quantity: required.extra_dash,
                    extraName: required.extra_name,
                    extraPrice: required.extra_price
                })
            });
            optionalList.map((optional, key) => {
                extras.push({
                    id: optional.extra_id,
                    quantity: optional.extra_dash,
                    extraName: optional.extra_name,
                    extraPrice: optional.extra_price
                })
            });
            cartProducts.push({
                cartId: Date.now(),
                variantId: product.variant_id,
                productId: product.product_id,
                productName: product.product_name,
                productDescription: product.product_description,
                allergens: product.allergens_name,
                productPrice: product.product_price,
                boxPrice: isEmpty(product.box_price) ? null : product.box_price,
                quantity: quantity,
                message: comment,
                extras
            });
            var totalBadge = 0;
            cartProducts.map((cartProduct, key) => {
                totalBadge += cartProduct.quantity;
            });

            dispatch(setCartRestaurant(restaurant));
            dispatch(setCartProducts(cartProducts));
            dispatch(setCartBadge(totalBadge));
            // dispatch(setCartBadge(cartBadge + 1));
            dispatch(setCartToast(!cartToast));
            props.navigation.goBack();
        }
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft} />
                <Text style={common.headerTitleText}>{i18n.translate('Extra')}</Text>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon type='ionicon' name='ios-close' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
            </Header>
            <Content contentContainerStyle={{ width: wp('100%'), padding: 15 }}>
                <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>{product.product_name}</Text>
                <Text style={{ marginTop: 10, fontSize: 14 }} numberOfLines={1}>{product.product_description}</Text>
                {!isEmpty(product.allergens_name) ? (
                    <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {product.allergens_name.map((allergen, key) => (
                        <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != product.allergens_name.length - 1 ? ', ' : ''}</Text>
                    ))})</Text>
                ) : null}
                {!isEmpty(requireds) && (
                    <Text style={{ marginTop: 30, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Optional soft drinks (')}{requireds.length}{i18n.translate('db Required)')}</Text>
                )}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={requireds}
                    keyExtractor={(required, index) => index.toString()}
                    renderItem={(required, index) => (
                        <Required
                            required={required.item}
                            index={index}
                            requiredList={requiredList}
                            onSelect={(check, required, count) => onSelect(1, check, required, count)}
                        />
                    )}
                />
                {/* <View style={{ width: wp('100%'), marginLeft: -10, height: 1, backgroundColor: '#C4C4C4' }} /> */}
                {!isEmpty(optionals) && (
                    <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Optional Things(optional)')}</Text>
                )}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={optionals}
                    keyExtractor={(optional, index) => index.toString()}
                    renderItem={(optional, index) => (
                        <Optional
                            optional={optional.item}
                            index={index}
                            optionalList={optionalList}
                            onSelect={(check, optional, count) => onSelect(2, check, optional, count)}
                        />
                    )}
                />
                {(!isEmpty(requireds) || !isEmpty(optionals)) && (
                    <Fragment>
                        <View style={{ width: wp('100%'), marginLeft: -10, height: 1, backgroundColor: '#C4C4C4' }} />
                        <View style={{ width: '100%', height: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F78F1E' }}>{i18n.translate('Show me the rest')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                )}

                <Card key='review' style={styles.card}>
                    <View style={[common.flexRow, { marginTop: 10 }]}>
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
                <TouchableOpacity disabled={minRequired > requiredList.length} style={[styles.button, { backgroundColor: minRequired > requiredList.length ? '#AAA' : colors.YELLOW.PRIMARY }]} onPress={() => onAdd()}>
                    <Text style={styles.buttonText}>{i18n.translate('Add to the cart')}</Text>
                </TouchableOpacity>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    allergenList: {
        marginTop: 12,
        width: '100%',
        fontSize: 16,
        color: '#999'
    },
    allergen: {
        marginTop: 12,
        fontSize: 16,
        color: '#999'
    },
    items: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15
    },

    check: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    item: {
        width: wp('100%') - 70,
    },
    productCart: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    cart: {
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
    card: {
        width: '100%',
        // padding: 10,
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
    button: {
        marginTop: 30,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.WHITE
    }
});