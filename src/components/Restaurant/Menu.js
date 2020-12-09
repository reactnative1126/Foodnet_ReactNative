import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { RES_URL } from '@constants/configs';
import { CartWhiteIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';
import FastImage from 'react-native-fast-image';
import ContentLoader from 'react-native-easy-content-loader';

const RenderOne = ({ one, index, onMinus, onPlus }) => {
    const [loader, setLoader] = useState(true);
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
            <View key={index} style={loader ? styles.loader : styles.product}>
                <FastImage style={styles.productImage} source={{ uri: RES_URL + one.item.productImageUrl }} resizeMode='cover' onLoadEnd={e => setLoader(false)} />
                <Text style={styles.productTitle} numberOfLines={1}>{one.item.productTitle}</Text>
                <Text style={styles.productDescription}>{one.item.productDescription}</Text>
                {!isEmpty(one.item.allergens) ? (
                    <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {one.item.allergens.map((allergen, key) => (
                        <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != one.item.allergens.length - 1 ? ', ' : ''}</Text>
                    ))})</Text>
                ) : null}
                <View style={styles.productCart}>
                    <Text style={styles.price}>{one.item.productPrice} Ft</Text>
                    <View style={styles.cart}>
                        <TouchableOpacity style={styles.countButton1} onPress={() => onMinus(one.item)}>
                            <Icon type='material-community' name='minus' color='#333' size={25} />
                        </TouchableOpacity>
                        <View style={styles.count}>
                            <Text style={{ color: '#333' }}>{one.item.cart_count} db</Text>
                        </View>
                        <TouchableOpacity style={styles.countButton2} onPress={() => onPlus(one.item)}>
                            <Icon type='material-community' name='plus' color='#333' size={25} />
                        </TouchableOpacity>
                        <View style={{ width: 10 }} />
                        <TouchableOpacity style={styles.check}>
                            {one.item.cart_count > 0 ? (<Icon type='material' name='check' color={colors.WHITE} size={25} />) : (<CartWhiteIcon />)}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Fragment>
    )
}

export default Menu = (props) => {
    useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity key={index} style={[styles.category, props.category == item.item.category_id ? common.borderColorYellow : common.borderColorGrey]}
                onPress={() => props.onCategory(item.item.category_id)}>
                <Text style={styles.name}>{item.item.category_name}</Text>
            </TouchableOpacity>
        )
    }

    const renderProduct = (product, index) => {
        return (
            <Card key={index} style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 16 }]}>{product.item.category_name}</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={product.item.product_list}
                    keyExtractor={(one, index) => index.toString()}
                    renderItem={(one, index) => (<RenderOne one={one} index={index} onMinus={props.onMinus} onPlus={props.onPlus} />)}
                />
            </Card>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ height: 20 }} />
            <Card key='menu' style={styles.card}>
                <Text style={styles.cardTitle}>{i18n.translate('Menu')}</Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={[{ category_id: 0, category_name: i18n.translate('All') }, ...props.categories]}
                    keyExtractor={(category, index) => index.toString()}
                    renderItem={renderItem}
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
            {isEmpty(props.products) ? (
                <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                    <Text style={[styles.cardTitle, { textAlign: 'center' }]}>{i18n.translate('No Menu')}</Text>
                </View>
            ) : (
                    <FlatList
                        contentContainerStyle={{ paddingVertical: 20 }}
                        showsHorizontalScrollIndicator={false}
                        data={props.products}
                        keyExtractor={(product, index) => index.toString()}
                        renderItem={renderProduct}
                    />
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
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: Platform.OS === 'ios' ? 10 : 0, height: Platform.OS === 'ios' ? 12 : 12 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: Platform.OS === 'ios' ? 24 : 5,
        borderRadius: 6,
    },
    productImage: {
        width: '100%',
        height: 80,
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
    }
});