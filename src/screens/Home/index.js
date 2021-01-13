import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setFilters } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { Cities, Dashboard, Filters } from '@components';
import { common, colors } from '@constants/themes';
import { CartYellowIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Home = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { cartBadge, filters } = useSelector(state => state.food);

    const [cityStatus, setCityStatus] = useState(false);
    const [filterStatus, setFilterStatus] = useState(false);
    const [promotion, setPromotion] = useState([]);
    const [popular, setPopular] = useState([]);
    const [result, setResult] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setCityStatus(false);
        setFilterStatus(false);
        dispatch(setLoading(true));
        FoodService.promotion(country, logged ? user.city.name : city.name)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setPromotion(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
            });
        FoodService.popular(country, logged ? user.city.name : city.name)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setPopular(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
            });
        FoodService.all(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                dispatch(setLoading(false));
                setRefresh(false);
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setRefresh(false);
            });
    }, [country, city, user, refresh, filters]);

    useEffect(() => {
        FoodService.result(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
            });
    }, [search]);

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => {
                        setCityStatus(false);
                        props.navigation.openDrawer();
                    }}>
                        <Icon type='ionicon' name='menu' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle} onPress={() => setCityStatus(!cityStatus)}>
                    <Text style={common.headerTitleText}>{!logged ? city.name : user.city.name}</Text>
                    <Icon type='material' name={cityStatus ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color={colors.BLACK} />
                </TouchableOpacity>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('Cart');
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
                                    {/* <CartYellowIcon />
                                    <View style={styles.badgeEmpty} /> */}
                                    <View />
                                </Fragment>
                            )}
                    </TouchableOpacity>
                </View>
            </Header>
            {
                !cityStatus ? !filterStatus ?
                    <Dashboard
                        featured={promotion}
                        trendy={popular}
                        result={result}
                        refresh={refresh}
                        search={search}
                        filters={filters}
                        onFilter={() => setFilterStatus(!filterStatus)}
                        onRefresh={() => setRefresh(true)}
                        onSearch={(value) => setSearch(value)}
                        onDetail={(item) => props.navigation.push('Detail', { restaurant: item })}
                    /> :
                    <Filters
                        filters={filters}
                        onFilters={(value) => {
                            dispatch(setFilters(value));
                            setFilterStatus(false);
                        }}
                        onCancel={() => setFilterStatus(false)}
                    /> :
                    <Cities
                        onSave={() => setCityStatus(false)}
                        onLoading={(load) => dispatch(setLoading(load))}
                    />
            }
        </Container>
    );
}

const styles = StyleSheet.create({
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