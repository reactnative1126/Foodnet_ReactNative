import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setFilters } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { Cities, Dashboard, Filters } from '@components';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

export default Home = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { filters } = useSelector(state => state.food);

    const [cityStatus, setCityStatus] = useState(false);
    const [filterStatus, setFilterStatus] = useState(false);
    const [promotion, setPromotion] = useState([]);
    const [popular, setPopular] = useState([]);
    const [result, setResult] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    // const [count, setCount] = useState(0);

    useEffect(() => {
        setCityStatus(false);
        setFilterStatus(false);
        // setCount(0);
        dispatch(setLoading(true));
        FoodService.promotion(country, logged ? user.city.name : city.name)
            .then((response) => {
                // setCount(count + 1);
                // if (count > 2) {
                //     dispatch(setLoading(false));
                // }
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
        dispatch(setLoading(true));
        FoodService.result(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                setResultLoader(true);
                setRefresh(false);
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
                dispatch(setLoading(false));
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
                <View style={common.headerRight} />
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

});