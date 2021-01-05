import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartProducts } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { CartWhiteIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import moment from 'moment';
import { TextField } from 'react-native-material-textfield';
import FastImage from 'react-native-fast-image';
import ContentLoader from 'react-native-easy-content-loader';

const Product = ({ cartRestaurant, cartProducts, restaurant, product, index, onExtra, onModal, onCart }) => {
    const [loader, setLoader] = useState(true);
    const [count, setCount] = useState(1);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        // console.log('1--', moment(product.startTime).format('MM/DD/YYYY, h:mm:ss A'))
        // console.log('2--', moment().format('MM/DD/YYYY, h:mm:ss A'))
        // console.log('3--', moment(product.endTime).format('MM/DD/YYYY, h:mm:ss A'))
        // console.log('4--', product.soldOut)
        var index = cartProducts.findIndex((cartProduct) => {
            return cartRestaurant.restaurant_id == restaurant.restaurant_id && cartProduct.productId == product.product_id && cartProduct.variantId == product.variant_id
        });
        if (index >= 0) {
            setCount(cartProducts[index].quantity);
            setFlag(true);
        }
    });

    return (
        <Fragment>
            <ContentLoader
                active
                title={false}
                pRows={3}
                pWidth={['100%', '90%', '50%', 50]}
                pHeight={[125, 10, 8, 20]}
                loading={loader}
                containerStyles={styles.loader}
            />
            <View key={index} style={loader ? styles.default : styles.product}>
                {(
                    (!isEmpty(product.startTime) && moment(product.startTime).format('MM/DD/YYYY, h:mm:ss A') > moment().format('MM/DD/YYYY, h:mm:ss A')) ||
                    (!isEmpty(product.endTime) && moment().format('MM/DD/YYYY, h:mm:ss A') > moment(product.endTime).format('MM/DD/YYYY, h:mm:ss A')) ||
                    product.soldOut == 1
                ) && (
                        <View style={styles.overlay} />
                    )}
                <FastImage style={styles.productImage} source={{ uri: RES_URL + product.product_imageUrl }} resizeMode='cover' onLoadEnd={e => setLoader(false)} />
                <Text style={styles.productTitle} numberOfLines={1}>{product.product_name}</Text>
                {isEmpty(product.soldOut) && (
                    <Text style={styles.productDescription}>{product.product_description}</Text>
                )}
                {isEmpty(product.soldOut) && !isEmpty(product.allergens_name) ? (
                    <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {product.allergens_name.map((allergen, key) => (
                        <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != product.allergens_name.length - 1 ? ', ' : ''}</Text>
                    ))})</Text>
                ) : null}
                {!isEmpty(product.soldOut) && (
                    <View style={styles.dailyWrapper}>
                        <Text style={styles.extrasText} numberOfLines={1}><Text style={{ fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Soup')}: </Text>{'Product name'}</Text>
                        {!isEmpty(product.allergens_name) ? (
                            <Text style={[styles.allergenList, { marginTop: 0 }]}>({i18n.translate('Allergens')}: {product.allergens_name.map((allergen, key) => (
                                <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != product.allergens_name.length - 1 ? ', ' : ''}</Text>
                            ))})</Text>
                        ) : null}
                        <View style={{ height: 20 }} />
                        <Text style={styles.extrasText} numberOfLines={1}><Text style={{ fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Main course')}: </Text>{'Product name'}</Text>
                        {!isEmpty(product.allergens_name) ? (
                            <Text style={[styles.allergenList, { marginTop: 0 }]}>({i18n.translate('Allergens')}: {product.allergens_name.map((allergen, key) => (
                                <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != product.allergens_name.length - 1 ? ', ' : ''}</Text>
                            ))})</Text>
                        ) : null}
                        <View style={{ height: 20 }} />
                        <Text style={styles.extrasText} numberOfLines={1}><Text style={{ fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Dessert')}: </Text>{'Product name'}</Text>
                        {!isEmpty(product.allergens_name) ? (
                            <Text style={[styles.allergenList, { marginTop: 0 }]}>({i18n.translate('Allergens')}: {product.allergens_name.map((allergen, key) => (
                                <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != product.allergens_name.length - 1 ? ', ' : ''}</Text>
                            ))})</Text>
                        ) : null}
                        <View style={{ height: 20 }} />
                        <Text style={styles.extrasText} numberOfLines={1}><Text style={{ fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Available')}: </Text>{product.startTime.split(', ')[1]}-{product.endTime.split(', ')[1]}</Text>
                    </View>
                )}
                <View style={styles.productCart}>
                    <Text style={styles.price}>{product.product_price} {i18n.translate('lei')}</Text>
                    <View style={styles.cart}>
                        <TouchableOpacity style={styles.countButton1} disabled={count == 1 || flag} onPress={() => count > 1 && setCount(count - 1)}>
                            <Icon type='material-community' name='minus' color='#333' size={25} />
                        </TouchableOpacity>
                        <View style={styles.count}>
                            <Text style={{ color: '#333' }}>{count} db</Text>
                        </View>
                        <TouchableOpacity style={styles.countButton2} disabled={flag} onPress={() => setCount(count + 1)}>
                            <Icon type='material-community' name='plus' color='#333' size={25} />
                        </TouchableOpacity>
                        <View style={{ width: 10 }} />
                        <TouchableOpacity 
                            style={[styles.check, { backgroundColor: (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(restaurant.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(restaurant.restaurant_close.replace(':', ''))) ? colors.GREY.PRIMARY : colors.YELLOW.PRIMARY }]}
                            disabled={(parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(restaurant.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(restaurant.restaurant_close.replace(':', '')))} 
                            onPress={() => {
                                if (!isEmpty(cartProducts) && cartRestaurant.restaurant_id != restaurant.restaurant_id) {
                                    onModal();
                                } else {
                                    flag ? onCart() : onExtra(product, count);
                                }
                            }}>
                            {flag ? (<Icon type='material' name='check' color={colors.WHITE} size={25} />) : (<CartWhiteIcon />)}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Fragment>
    )
}

export default Menu = (props) => {
    const dispatch = useDispatch();
    const { country } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts } = useSelector(state => state.food);

    const [products, setProducts] = useState([]);

    useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

    useEffect(() => {
        dispatch(setLoading(true));
        setProducts([]);
        FoodService.products(country, props.restaurant.restaurant_id, props.category.category_id, props.subCategory.subcategoryId, props.subCategory.propertyValTransId, props.search)
            .then(async (response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setProducts(response.result);
                } else {
                    // dispatch(setLoading(false));
                    setProducts([]);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setProducts([]);
            });
    }, [props.subCategory, cartRestaurant, cartProducts]);

    return (
        <View style={styles.container}>
            <View style={{ height: 20 }} />
            <Card key='menu' style={styles.card}>
                <Text style={styles.cardTitle}>{i18n.translate('Menu')}</Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={props.categories}
                    keyExtractor={(category, index) => index.toString()}
                    renderItem={(item, index) => (
                        <TouchableOpacity key={index} style={[styles.category, props.category.category_id == item.item.category_id ? common.borderColorYellow : common.borderColorGrey]}
                            onPress={() => props.onCategory(item.item)}>
                            <Text style={styles.name}>{item.item.category_name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </Card>
            <View style={{ height: 10 }} />
            <Card key='subcategories' style={styles.card}>
                <Text style={styles.cardTitle}>{i18n.translate('What kind of ')}{props.category.category_name}{i18n.translate('do you care about?')}</Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={props.subCategories}
                    keyExtractor={(subCategory, index) => index.toString()}
                    renderItem={(item, index) => (
                        <TouchableOpacity key={index} style={[styles.category, props.subCategory.propertyValTransId == item.item.propertyValTransId ? common.borderColorYellow : common.borderColorGrey]}
                            onPress={() => props.onSubCategory(item.item)}>
                            <Text style={styles.name}>{item.item.subcategories_name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </Card>
            <View style={{ height: 10 }} />
            <Card key='food' style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 14 }]}>{i18n.translate('Find food')}</Text>
                <TextField
                    placeholder={i18n.translate('Name of food')}
                    placeholderTextColor='#666'
                    fontSize={16}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    value={props.search}
                    containerStyle={styles.textContainer}
                    inputContainerStyle={styles.inputContainer}
                    onChangeText={(value) => props.onSearch(value)}
                />
            </Card>
            {isEmpty(products) ? (
                <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                    <Text style={[styles.cardTitle, { textAlign: 'center' }]}>{i18n.translate('No Menu')}</Text>
                </View>
            ) : (
                    <Card key='product' style={styles.card}>
                        <Text style={[styles.cardTitle, { marginTop: 20, fontSize: 14 }]}>{props.category.category_name} - {props.subCategory.subcategories_name}</Text>
                        <FlatList
                            contentContainerStyle={{ paddingVertical: 20 }}
                            showsHorizontalScrollIndicator={false}
                            data={products}
                            keyExtractor={(product, index) => index.toString()}
                            renderItem={(product, index) => (
                                <Product
                                    cartRestaurant={cartRestaurant}
                                    cartProducts={cartProducts}
                                    restaurant={props.restaurant}
                                    product={product.item}
                                    index={index}
                                    onExtra={props.onExtra}
                                    onCart={props.onCart}
                                    onModal={props.onModal}
                                />
                            )}
                        />
                    </Card>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 20
    },
    card: {
        marginHorizontal: 20,
        width: wp('100%') - 40
    },
    cardTitle: {
        marginVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        width: '100%'
    },
    category: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 2,
        borderColor: colors.YELLOW.PRIMARY,
        borderRadius: 6,
        marginRight: 10
    },
    name: {
        fontWeight: 'bold',
        color: '#333'
    },
    textContainer: {
        width: wp('100%') - 40,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
        borderColor: colors.GREY.PRIMARY
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0
    },
    loader: {
        marginBottom: 24,
        width: wp('100%') - 40,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        backgroundColor: colors.WHITE,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: Platform.OS === 'ios' ? 10 : 0, height: Platform.OS === 'ios' ? 12 : 12 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: Platform.OS === 'ios' ? 24 : 5,
        borderRadius: 6,
    },
    default: {
        height: 0
    },
    product: {
        marginBottom: 24,
        width: wp('100%') - 40,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        backgroundColor: colors.WHITE,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: Platform.OS === 'ios' ? 0.5 : 0.7,
        shadowRadius: 5,
        elevation: 5,
        borderRadius: 6,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 6
    },
    productTitle: {
        width: '100%',
        marginTop: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111'
    },
    productDescription: {
        marginTop: 8,
        width: '100%',
        fontSize: 16,
        lineHeight: 24,
        color: '#666'
    },
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
    productCart: {
        marginTop: 26,
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
    check: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 4,
        backgroundColor: colors.YELLOW.PRIMARY
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
    dailyWrapper: {
        marginTop: 10,
        width: '100%'
    },
    extrasText: {
        width: '100%',
        fontSize: 16,
        color: '#333'
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 2000
    }
});