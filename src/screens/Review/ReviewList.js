import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { ProfileService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { TrustIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default ReviewList = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { reviewStatus } = useSelector(state => state.profile);

    const [visible, setVisible] = useState(false);
    const [addReviewList, setAddReviewList] = useState([]);
    const [viewReviewList, setViewReviewList] = useState([]);

    useEffect(() => {
        dispatch(setLoading(true));
        ProfileService.addReviews(user.token)
            .then((response) => {
                if (response.status == 200) {
                    setAddReviewList(response.result);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        ProfileService.viewReviews(user.token)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setViewReviewList(response.result);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                console.log(error.message);
            });
    }, [reviewStatus]);

    const goReview = (type, reviewCode, reviewId) => {
        dispatch(setLoading(true));
        ProfileService.getReview(user.token, reviewId)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    props.navigation.push('ReviewAdd', { type, reviewCode, review: response.result[0] });
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                console.log(error.message);
            });
    }

    const renderItem = (review, index) => {
        return (
            <View key={index} style={styles.review}>
                <View style={styles.status}>
                    <Text style={styles.statusText}>{i18n.translate('Kit')}</Text>
                    <Text style={styles.statusText}>{i18n.translate('Operations')}</Text>
                </View>
                <View style={styles.reviewMain}>
                    <Text style={styles.reviewText} numberOfLines={1}>{review.item.restaurant_name}</Text>
                    {!isEmpty(review.item.review_code) ? (
                        <TouchableOpacity onPress={() => goReview(1, review.item.review_code, review.item.review_Id)}>
                            <Text style={styles.reviewAdd}>{i18n.translate('Add')}</Text>
                        </TouchableOpacity>
                    ) : (
                            <View style={styles.reviewOption}>
                                <TouchableOpacity onPress={() => goReview(2, 0, review.item.review_Id)}>
                                    <Text style={styles.reviewAdd}>{i18n.translate('View')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => props.navigation.push('ReviewDelete', { review: review.item })}>
                                    <TrustIcon />
                                </TouchableOpacity>
                                {/* <Icon type='ant-design' name='delete' size={20} color='#999' onPress={() => props.navigation.push('ReviewDelete', { review: review.item })} /> */}
                            </View>
                        )}
                </View>
                <View style={styles.status}>
                    <Text style={styles.statusText}>{i18n.translate('When')}</Text>
                </View>
                <View style={styles.reviewMain}>
                    <Text style={styles.reviewText} numberOfLines={1}>{!isEmpty(review.item.review_created) && review.item.review_created.replace('T', ' - ')}</Text>
                </View>
            </View>
        )
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
                    <Text style={common.headerTitleText} numberOfLines={1}>{i18n.translate('Restaurants reviews')}</Text>
                </TouchableOpacity>
                <View style={common.headerRight} />
            </Header>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={styles.descriptionText}>{i18n.translate('You can only write a review if you have ordered at least 5 times before')}</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[...addReviewList, ...viewReviewList]}
                    keyExtractor={(result, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>
            {visible ?
                <SaveModal
                    onDelete={() => onDelete()}
                    onCancel={() => setVisible(false)} /> : null}
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
    review: {
        width: '100%',
        marginTop: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4'
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 5
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999999'
    },
    reviewMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 30,
        marginBottom: 5
    },
    reviewText: {
        width: '70%',
        fontSize: 16,
        lineHeight: 24,
        color: '#111'
    },
    reviewOption: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 100
    },
    reviewAdd: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
});