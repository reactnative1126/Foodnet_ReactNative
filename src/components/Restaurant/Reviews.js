import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { StarYellowIcon, StarGreyIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Reviews = (props) => {
    useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

    const renderItem = (review, index) => {
        return (
            <TouchableOpacity key={index} style={styles.review}>
                <Text style={styles.userName}>{review.item.user_name}</Text>
                <Text style={styles.userMessage}>{review.item.user_message}</Text>
                <View style={styles.userRating}>
                    <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
                    <Text style={styles.userRate}>{review.item.user_rating}/5</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ height: 20 }} />
            <Card key='Evaluation' style={styles.card}>
                <Text style={styles.cardTitle}>{i18n.translate('Evaluation')}</Text>
            </Card>
            <Card key='Theaveragerating' style={styles.card}>
                <View style={styles.average}>
                    <StarYellowIcon />
                    <Text style={styles.averageTitle}>{i18n.translate('The average rating')}</Text>
                    <Text style={styles.averageRating}>{isEmpty(props.average) ? 0 : props.average}/5</Text>
                </View>
            </Card>
            <Card key='stars' style={styles.card}>
                <Text style={styles.starTitle}>{i18n.translate('FILTRATION')}</Text>
                <View style={styles.starView}>
                    <TouchableOpacity key='rating1' style={[styles.starItem, props.rating === 1 ? common.borderColorYellow : common.borderColorGrey]} onPress={() => props.onRating(1)}>
                        {props.rating === 1 ? <StarYellowIcon /> : <StarGreyIcon />}
                        <Text style={[styles.ratingTitle, props.rating === 1 ? common.fontWeightBold : common.fontWeightNormal]}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity key='rating2' style={[styles.starItem, props.rating === 2 ? common.borderColorYellow : common.borderColorGrey]} onPress={() => props.onRating(2)}>
                        {props.rating === 2 ? <StarYellowIcon /> : <StarGreyIcon />}
                        <Text style={[styles.ratingTitle, props.rating === 2 ? common.fontWeightBold : common.fontWeightNormal]}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity key='rating3' style={[styles.starItem, props.rating === 3 ? common.borderColorYellow : common.borderColorGrey]} onPress={() => props.onRating(3)}>
                        {props.rating === 3 ? <StarYellowIcon /> : <StarGreyIcon />}
                        <Text style={[styles.ratingTitle, props.rating === 3 ? common.fontWeightBold : common.fontWeightNormal]}>3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity key='rating4' style={[styles.starItem, props.rating === 4 ? common.borderColorYellow : common.borderColorGrey]} onPress={() => props.onRating(4)}>
                        {props.rating === 4 ? <StarYellowIcon /> : <StarGreyIcon />}
                        <Text style={[styles.ratingTitle, props.rating === 4 ? common.fontWeightBold : common.fontWeightNormal]}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity key='rating5' style={[styles.starItem, props.rating === 5 ? common.borderColorYellow : common.borderColorGrey]} onPress={() => props.onRating(5)}>
                        {props.rating === 5 ? <StarYellowIcon /> : <StarGreyIcon />}
                        <Text style={[styles.ratingTitle, props.rating === 5 ? common.fontWeightBold : common.fontWeightNormal]}>5</Text>
                    </TouchableOpacity>
                </View>
            </Card>
            {isEmpty(props.reviews) ? (
                <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>{i18n.translate('No reviews')}</Text>
                </View>
            ) : (
                    <FlatList
                        contentContainerStyle={{ paddingVertical: 20 }}
                        showsHorizontalScrollIndicator={false}
                        data={props.reviews}
                        keyExtractor={(review, index) => index.toString()}
                        renderItem={renderItem}
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
        width: '100%',
        marginBottom: 15,
    },
    cardTitle: {
        marginVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },
    cardText: {
        fontSize: 16,
        color: '#333',
        width: '100%'
    },
    average: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    averageTitle: {
        marginHorizontal: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
    },
    averageRating: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    starTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
    },
    starView: {
        marginTop: 7,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    starItem: {
        marginRight: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: '#C4C4C4'
    },
    ratingTitle: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333'
    },
    review: {
        marginTop: 24,
        marginHorizontal: 20,
        width: wp('100%') - 40,
        padding: 16,
        // borderWidth: 1,
        // borderColor: 'rgba(0, 0, 0, 0.15)',
        backgroundColor: colors.WHITE,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: Platform.OS === 'ios' ? 0.5 : 0.7,
        shadowRadius: 5,
        elevation: 5,
        borderRadius: 6,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111'
    },
    userMessage: {
        marginTop: 8,
        width: '100%',
        fontSize: 16,
        lineHeight: 24,
        color: '#666'
    },
    userRating: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        width: 50,
        height: 25,
        backgroundColor: '#FEEBD6',
        borderRadius: 6
    },
    userRate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
});