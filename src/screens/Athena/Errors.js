import React from 'react';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { common, colors } from '@constants/themes';
import { InternetIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Errors = (props) => {
    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.pop()}>
                        <Icon type='material' name='arrow-back' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Profile data')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <View style={styles.content}>
                <InternetIcon />
                <Text style={styles.mainText}>{i18n.translate('Operation failed')}</Text>
                <Text style={styles.subText}>{i18n.translate('Server error, please try again')}</Text>
                <TouchableOpacity style={styles.button} onPress={() => props.navigation.pop()}>
                    <Text style={styles.buttonText}>{i18n.translate('Again')}</Text>
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
    subText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666'
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