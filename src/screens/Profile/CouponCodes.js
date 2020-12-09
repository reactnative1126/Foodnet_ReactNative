import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, BackHandler, StatusBar, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setUser } from '@modules/reducers/auth/actions';
import { ProfileService } from '@modules/services';
import { isEmpty, validatePassword } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { ErrorIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default CouponCodes = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon type='material' name='arrow-back' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Coupon Codes')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                <View style={{ height: 12 }} />
                <Text style={styles.fenText}>{i18n.translate('Fennmaradt egyenleged')}: <Text style={styles.yellowText}>12345FT</Text></Text>
                <View style={styles.textContainer}>
                    <Text style={styles.fenText}>{i18n.translate('Your current subscription')}: <Text style={styles.yellowText}>Ingyenes</Text></Text>
                </View>
                <View style={styles.buttonView}>
                    <Text style={styles.yellowTitle}>2. {i18n.translate('Package name')}</Text>
                    <Text style={styles.normalText}>Havi 1200 Ft</Text>
                    <TouchableOpacity style={styles.button} onPress={() => alert('OK')}>
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Select')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <Text style={styles.yellowTitle}>3. {i18n.translate('Package name')}</Text>
                    <Text style={styles.normalText}>Havi 1200 Ft</Text>
                    <TouchableOpacity style={styles.button} onPress={() => alert('OK')}>
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Select')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={common.height50} />
            </Content>
        </Container >
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    fenText: {
        fontSize: 16,
    },
    yellowText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    textContainer: {
        justifyContent: 'center',
        marginTop: 14,
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    buttonView: {
        marginTop: 24,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FEEBD6',
        borderRadius: 10
    },
    yellowTitle: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    normalText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '400'
    },
    button: {
        marginTop: 18,
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.YELLOW.PRIMARY,
        borderRadius: 10
    }
});
