import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, SafeAreaView, FlatList, View, Text, Animated, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { Menu, Information, Reviews } from '@components';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { BackWhiteIcon, CartWhiteIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import moment from 'moment';
import { TabView, TabBar } from 'react-native-tab-view';

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default Detail = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { filters } = useSelector(state => state.food);

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'menu', title: i18n.translate('MENU') },
        { key: 'info', title: i18n.translate('INFORMATION & PROMOTIONS') },
        { key: 'third', title: i18n.translate('EVALUATION') },
    ]);

    const [restaurant, setRestaurant] = useState(props.route.params.restaurant);
    const [filterList, setFilterList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(0);
    const [products, setProducts] = useState([]);
    const [information, setInformation] = useState({
        restaurant_id: 0,
        restaurant_avgTransport: 0,
        restaurant_discount: 1,
        restaurant_phoneNumber: '',
        restaurant_address: '',
        restaurant_description: ''
    });
    const [search, setSearch] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);


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

    useEffect(() => {
        const getFilterList = () => {
            var tempFilters = [];
            if (filters.freeDelivery == 1) tempFilters = [...tempFilters, { filter: i18n.translate('No shipping costs') }];
            if (filters.newest == 1) tempFilters = [...tempFilters, { filter: i18n.translate('News') }];
            if (filters.pizza == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Pizza') }];
            if (filters.hamburger == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Hamburger') }];
            if (filters.dailyMenu == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Daily menu') }];
            if (filters.soup == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Soup') }];
            if (filters.salad == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Salat') }];
            if (filters.money == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Cash') }];
            if (filters.card == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Card') }];
            if (filters.withinOneHour == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Within 1 hour') }];
            setFilterList(tempFilters);
        }
        getFilterList();

        const getInformation = () => {
            FoodService.information(country, restaurant.restaurant_name)
                .then((response) => {
                    if (response.status == 200) {
                        setInformation(response.result[0]);
                    }
                });
        }

        setTimeout(() => getInformation(), 500);

        return () => console.log('Unmounted');
    }, []);

    useEffect(() => {
        if (category === 0) {
            dispatch(setLoading(true));
            FoodService.categories(country, restaurant.restaurant_name, search)
                .then(async (response) => {
                    if (response.status == 200) {
                        var categoriesTemp = [];
                        var productsTemp = [];
                        await Object.keys(response.result).map((key) => {
                            const items = response.result[key];
                            categoriesTemp = [...categoriesTemp, {
                                category_id: items[0].category_id,
                                category_name: key
                            }];
                            productsTemp = [...productsTemp, {
                                category_name: key,
                                product_list: items
                            }]
                        });

                        var productsFinal = await Promise.all(productsTemp.map(async (productOne, key) => {
                            var productList = await Promise.all(productOne.product_list.map(async (product, key) => {
                                var allergens = await FoodService.allergen(country, product.productId, restaurant.restaurant_name);
                                return { ...product, allergens, cart_count: 0 };
                            }));
                            return { ...productOne, product_list: productList }
                        }));
                        setCategories(categoriesTemp);
                        setProducts(productsFinal);
                    }
                    dispatch(setLoading(false));
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        } else {
            dispatch(setLoading(true));
            FoodService.products(country, category, restaurant.restaurant_name, search)
                .then(async (response) => {
                    if (response.status == 200) {
                        var productsFinal = await Promise.all(response.result.map(async (productOne, key) => {
                            var productList = await Promise.all(productOne.product_list.map(async (product, key) => {
                                var allergens = await FoodService.allergen(country, product.productId, restaurant.restaurant_name);
                                return { ...product, allergens, cart_count: 0 };
                            }));
                            return { ...productOne, product_list: productList }
                        }));
                        setProducts(productsFinal);
                    }
                    dispatch(setLoading(false));
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }

        FoodService.reviews(restaurant.restaurant_name, rating)
            .then((response) => {
                if (response.status == 200) {
                    setReviews(response.result[0].ratings);
                    setAverage(response.result[0].AVGrating);
                }
            });
    }, [category, rating, country]);

    useEffect(() => {
        if (category === 0) {
            FoodService.categories(country, restaurant.restaurant_name, search)
                .then(async (response) => {
                    if (response.status == 200) {
                        var productsTemp = [];
                        await Object.keys(response.result).map((key) => {
                            const items = response.result[key];
                            productsTemp = [...productsTemp, {
                                category_name: key,
                                product_list: items
                            }]
                        });

                        var productsFinal = await Promise.all(productsTemp.map(async (productOne, key) => {
                            var productList = await Promise.all(productOne.product_list.map(async (product, key) => {
                                var allergens = await FoodService.allergen(country, product.productId, restaurant.restaurant_name);
                                return { ...product, allergens, cart_count: 0 };
                            }));
                            return { ...productOne, product_list: productList }
                        }));
                        setProducts(productsFinal);
                    }
                })
        } else {
            FoodService.products(country, category, restaurant.restaurant_name, search)
                .then(async (response) => {
                    if (response.status == 200) {
                        var productsFinal = await Promise.all(response.result.map(async (productOne, key) => {
                            var productList = await Promise.all(productOne.product_list.map(async (product, key) => {
                                var allergens = await FoodService.allergen(country, product.productId, restaurant.restaurant_name);
                                return { ...product, allergens, cart_count: 0 };
                            }));
                            return { ...productOne, product_list: productList }
                        }));
                        setProducts(productsFinal);
                    }
                })
        }
    }, [search]);

    return (
        <SafeAreaView style={styles.saveArea}>
            <Animated.ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
                <TabView navigationState={{ index, routes }}
                    swipeEnabled={Platform.OS === 'ios' ? true : false}
                    renderTabBar={(props) => (
                        <TabBar {...props}
                            scrollEnabled={true}
                            style={styles.tabBar}
                            tabStyle={{ width: 'auto' }}
                            indicatorStyle={styles.tabIndicator}
                            renderLabel={({ route, focused }) => (
                                <Text style={[styles.tabLabel, { color: focused ? colors.YELLOW.PRIMARY : '#333' }]}>{route.title}</Text>
                            )}
                        />)}
                    renderScene={({ route, jumpTo }) => {
                        switch (route.key) {
                            case 'menu':
                                return <Menu
                                    categories={categories}
                                    category={category}
                                    search={search}
                                    products={products}
                                    onMinus={(value) => alert('Minus')}
                                    onPlus={(value) => alert('Plus')}
                                    onCategory={(value) => setCategory(value)}
                                    onSearch={(value) => setSearch(value)}
                                    jumpTo={jumpTo} />;
                            case 'info':
                                return <Information information={information} jumpTo={jumpTo} />;
                            case 'third':
                                return <Reviews reviews={reviews} average={average} rating={rating} onRating={(value) => setRating(value)} jumpTo={jumpTo} />;
                        }
                    }}
                    onIndexChange={setIndex}
                />
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
                        <FlatList
                            style={styles.typeList}
                            contentContainerStyle={styles.flatList}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={filterList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item, index) => (
                                <TouchableOpacity key={index} style={styles.typeItem}>
                                    <Text style={styles.typeText}>{item.item.filter}</Text>
                                </TouchableOpacity>
                            )}
                        />
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
                        <Animated.View style={[styles.headerMiddle, { opacity: titleOpacity }]}>
                            <View style={styles.headerRating}>
                                <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
                                <Text style={styles.headerRate}>{isEmpty(average) ? 0 : average}/5</Text>
                            </View>
                        </Animated.View>
                    </Animated.View>
                    <View style={common.headerRight}>
                        <TouchableOpacity >
                            <CartWhiteIcon />
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
    headerMiddle: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    headerRating: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        width: 50,
        height: 25,
        backgroundColor: '#FEEBD6',
        borderRadius: 6
    },
    headerRate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
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
        marginTop: -35,
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
    typeList: {
        marginTop: 20,
        marginLeft: 20,
        width: wp('100%') - 145,
        height: 50
    },
    flatList: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    typeItem: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#FEEBD6',
        borderRadius: 6,
        marginRight: 8
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY,
    },
    content: {
        paddingTop: HEADER_MAX_HEIGHT - 32
    },
    tabBar: {
        paddingTop: Platform.OS == 'ios' ? -10 : 30,
        backgroundColor: colors.WHITE,
        borderBottomWidth: 2,
        borderBottomColor: '#C4C4C4',
        elevation: 0
    },
    tabIndicator: {
        marginLeft: 10,
        backgroundColor: colors.YELLOW.PRIMARY,
        height: 3,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: 'bold'
    },
});