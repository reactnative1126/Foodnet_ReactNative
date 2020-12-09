import React from 'react';
import { StyleSheet, ActivityIndicator, View, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themes, colors } from '@constants/themes';

const Loading = (props) => {
    return (
        <Modal animationType="fade" transparent={true} visible={props.loading} >
            <View style={styles.container}>
                <View style={styles.indicator}>
                    <ActivityIndicator style={{ height: 80 }} size="large" color={colors.WHITE} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicator: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
    }
});

export default Loading;