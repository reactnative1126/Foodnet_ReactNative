import React from 'react';
import { Platform, StatusBar, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Container } from 'native-base';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { common, colors } from '@constants/themes';
import { SplashIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Splash = (props) => {
    return (
        <Container style={common.container}>
            <StatusBar hidden={true} />
            <View style={styles.content}>
                <SplashIcon />
                <ActivityIndicator style={styles.indicator} color={colors.YELLOW.PRIMARY}/>
                <Text style={styles.text}>{i18n.translate('Loading Application')}</Text>
            </View>
        </Container >
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    indicator: {
        marginTop: 24
    },
    text: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666'
    }
});
