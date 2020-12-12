import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, deleteUser } from '@modules/reducers/auth/actions';
import { ProfileService } from '@modules/services';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default ProfileDelete = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [visible, setVisible] = useState(false);
    const [reason, setReason] = useState('');

    const onDelete = () => {
        dispatch(setLoading(true));
        ProfileService.deleteProfile(user.token)
            .then((response) => {
                dispatch(setLoading(false));
                setVisible(false);
                if (response.status == 200) {
                    dispatch(deleteUser({
                        token: null,
                        email: '',
                        name: '',
                        city: {
                            id: 0,
                            name: '',
                            status: false
                        }
                    }));
                    props.navigation.reset({ index: 1, routes: [{ name: 'Start' }] });
                    // props.navigation.popToTop();
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setVisible(false);
            });
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
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Delete profile')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <Text style={[common.headerRightText, { color: '#F05050' }]}>{i18n.translate('Delete')}</Text>
                    </TouchableOpacity>
                </View>
            </Header>
            <Content style={styles.content}>
                <Card key='review' style={styles.card}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.labelText}>{i18n.translate('Reason')}</Text>
                        <Text style={styles.labelTextNormal}> ({i18n.translate('Optional')})</Text>
                    </View>
                    <TextField
                        keyboardType='default'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={reason}
                        multiline={true}
                        height={85}
                        containerStyle={[styles.textContainer, common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={(value) => setReason(value)}
                    />
                </Card>
                <View style={common.height50} />
            </Content>
            {visible ?
                <SaveModal
                    onDelete={() => onDelete()}
                    onCancel={() => setVisible(false)} /> : null}
        </Container >
    );
}

const SaveModal = (props) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.modalView}>
                <View style={styles.modalMain}>
                    <Text style={styles.modalTitle}>{i18n.translate('Delete profile data')}</Text>
                    <Text style={styles.modalDescription}>{i18n.translate('You can edit the city later by clicking on the city in header')}</Text>
                </View>
                <TouchableOpacity style={styles.modalButton} onPress={props.onDelete}>
                    <Text style={styles.saveText}>{i18n.translate('Delete')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={props.onCancel}>
                    <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    card: {
        width: '100%',
        marginTop: 20,
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    labelTextNormal: {
        fontSize: 16,
        color: colors.BLACK
    },
    textContainer: {
        width: '100%',
        marginTop: 10,
        height: 120,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0,
        overflow: "scroll"
    },
    modalContainer: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#00000080'
    },
    modalView: {
        justifyContent: 'space-between',
        width: wp('70%'),
        height: 200,
        backgroundColor: 'rgba(30, 30, 30, 0.75)',
        borderRadius: 14,
    },
    modalMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 110
    },
    modalTitle: {
        width: '80%',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    modalDescription: {
        marginTop: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 13,
        color: colors.WHITE
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 45,
        borderTopWidth: 2,
        borderTopColor: '#1E1E1E'
    },
    saveText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0AB4FF'
    },
    cancelText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#F05050'
    },
});
