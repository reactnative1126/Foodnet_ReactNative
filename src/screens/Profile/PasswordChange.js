import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setUser } from '@modules/reducers/auth/actions';
import { ProfileService } from '@modules/services';
import { isEmpty, validatePassword } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { ErrorIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default PasswordChange = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [oldPassword, setOldPassword] = useState('');
    const [visitOldPassword, setVisitOldPassword] = useState(false);
    const [errorOldPassword, setErrorOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [visitNewPassword, setVisitNewPassword] = useState(false);
    const [errorNewPassword, setErrorNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visitConfirmPassword, setVisitConfirmPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const [secureTextEntry2, setSecureTextEntry2] = useState(true);
    const [secureTextEntry3, setSecureTextEntry3] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setErrorMsg('');
        (visitOldPassword && isEmpty(oldPassword)) || (visitOldPassword && !validatePassword(oldPassword)) ? setErrorOldPassword(i18n.translate('The password must be at least 3 characters long')) : setErrorOldPassword('');
        (visitNewPassword && isEmpty(newPassword)) || (visitNewPassword && !validatePassword(newPassword)) ? setErrorNewPassword(i18n.translate('The password must be at least 3 characters long')) : setErrorNewPassword('');
        (visitConfirmPassword && isEmpty(confirmPassword)) || (visitConfirmPassword && !validatePassword(confirmPassword)) ? setErrorConfirmPassword(i18n.translate('The password must be at least 3 characters long')) : (confirmPassword.length >= 5 && newPassword !== confirmPassword) ? setErrorConfirmPassword(i18n.translate('The two passwords do not match')) : setErrorConfirmPassword('');
    }, [oldPassword, visitOldPassword, newPassword, visitNewPassword, confirmPassword, visitConfirmPassword]);

    const onChange = () => {
        if (!isEmpty(oldPassword) && !isEmpty(newPassword) && !isEmpty(confirmPassword) && isEmpty(errorOldPassword) && isEmpty(errorNewPassword) && isEmpty(errorConfirmPassword)) {
            dispatch(setLoading(true));
            ProfileService.modifyPassword(user.token, oldPassword, newPassword, confirmPassword)
                .then((response) => {
                    dispatch(setLoading(false));
                    if (response.status == 200) {
                        dispatch(setUser({
                            token: response.result.token,
                            email: user.email,
                            city: user.city
                        }));
                        props.navigation.goBack();
                    } else {
                        setErrorMsg(i18n.translate(response.msg));
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                    setErrorMsg(error.message);
                });
        }
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
                    <Text style={common.headerTitleText}>{i18n.translate('Change password')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => onChange()}>
                        <Text style={common.headerRightText}>{i18n.translate('Set')}</Text>
                    </TouchableOpacity>
                </View>
            </Header>
            <Content style={styles.content}>
                {!isEmpty(errorMsg) && (
                    <View style={common.errorContainer}>
                        <ErrorIcon />
                        <Text style={{ fontWeight: 'bold', color: '#F05050' }}>{errorMsg}</Text>
                        <View style={{ width: 30 }} />
                    </View>
                )}
                <View style={[styles.inputView, common.marginTop35]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorOldPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Old password')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorOldPassword) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <Text style={styles.characterText}>{i18n.translate('5+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={newPassword}
                        secureTextEntry={secureTextEntry1}
                        containerStyle={[styles.textContainer, !isEmpty(errorOldPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry2 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry1(!secureTextEntry1)} />
                            )
                        }}
                        onChangeText={(value) => {
                            setOldPassword(value);
                            setVisitOldPassword(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorOldPassword}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop35]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorNewPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('New password')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorNewPassword) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <Text style={styles.characterText}>{i18n.translate('5+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={newPassword}
                        secureTextEntry={secureTextEntry2}
                        containerStyle={[styles.textContainer, !isEmpty(errorNewPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry2 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry2(!secureTextEntry2)} />
                            )
                        }}
                        onChangeText={(value) => {
                            setNewPassword(value);
                            setVisitNewPassword(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorNewPassword}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop35]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorConfirmPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('New password again')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorConfirmPassword) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <Text style={styles.characterText}>{i18n.translate('5+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={confirmPassword}
                        secureTextEntry={secureTextEntry3}
                        containerStyle={[styles.textContainer, !isEmpty(errorConfirmPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry3 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry3(!secureTextEntry3)} />
                            )
                        }}
                        onChangeText={(value) => {
                            setConfirmPassword(value);
                            setVisitConfirmPassword(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorConfirmPassword}</Text>
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
    inputView: {
        marginTop: 20,
        width: '100%'
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
    characterText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '400',
        color: '#666'
    },
    textContainer: {
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0
    },
});
