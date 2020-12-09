import React, { useState } from 'react';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { common, colors } from '@constants/themes';
import { SuccessIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default DeliverySuccess = (props) => {
    const [type] = useState(props.route.params.type);
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
                    <Text style={common.headerTitleText}>{i18n.translate('Profile data')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <View style={styles.content}>
                <SuccessIcon />
                <Text style={styles.mainText}>{type == 1 ? i18n.translate('Successful data creation') : i18n.translate('Successful data modification')}</Text>
                <TouchableOpacity style={styles.button} onPress={()=>props.navigation.goBack()}>
                    <Text style={styles.buttonText}>{i18n.translate('Operations')}</Text>
                </TouchableOpacity>
                <View style={common.height50} />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainText: {
        marginTop: 30,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111'
    },
    button: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 6,
        backgroundColor: '#FEEBD6'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    }
});