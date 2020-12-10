import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setUser } from '@modules/reducers/auth/actions';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { BackIcon, GoogleIcon, ErrorIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default SignIn = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [visitEmail, setVisitEmail] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visitPassword, setVisitPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setErrorMsg('');
        (visitEmail && isEmpty(email)) || (visitEmail && !validateEmail(email)) ? setErrorEmail(i18n.translate('Email is not valid')) : setErrorEmail('');
    }, [email, visitEmail, password, visitPassword]);

    const onLogin = () => {
        dispatch(setLoading(true));
        AuthService.login(email, password)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200 || response.status == 201) {
                    var userEmail = user.email;
                    var userCity = user.city;
                    if (userCity.id === 0 || email !== userEmail) {
                        dispatch(setUser({
                            token: response.result[0].token,
                            email,
                            city: {
                                id: userCity.id,
                                name: userCity.name,
                                status: true
                            }
                        }));
                        props.navigation.navigate('Cities');
                    } else {
                        dispatch(setUser({
                            token: response.result[0].token,
                            email,
                            city: {
                                id: userCity.id,
                                name: userCity.name,
                                status: false
                            }
                        }));
                        props.navigation.navigate('App');
                    }
                } else {
                    setErrorMsg(i18n.translate(response.msg));
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setErrorMsg(error.message);
            });
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <BackIcon style={common.headerLeftIcon} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Log in')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                {!isEmpty(errorMsg) && (
                    <View style={common.errorContainer}>
                        <ErrorIcon />
                        <Text style={{ fontWeight: 'bold', color: '#F05050' }}>{errorMsg}</Text>
                        <View style={{ width: 30 }} />
                    </View>
                )}
                <View style={styles.inputView}>
                    <Text style={[styles.labelText, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('E-mail')}</Text>
                    <TextField
                        keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={email}
                        containerStyle={[styles.textContainer, !isEmpty(errorEmail) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={(value) => {
                            setEmail(value);
                            setVisitEmail(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorEmail}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop50]}>
                    <View style={styles.labelView}>
                        <Text style={[styles.labelText, !isEmpty(errorPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Password')}</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Forgot')}>
                            <Text style={[styles.labelText, common.fontColorYellow]}>{i18n.translate('Reset password')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={password}
                        secureTextEntry={secureTextEntry}
                        containerStyle={[styles.textContainer, !isEmpty(errorPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry(!secureTextEntry)} />
                            )
                        }}
                        onChangeText={(value) => {
                            setPassword(value);
                            setVisitPassword(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorPassword}</Text>
                </View>
                <View style={[styles.buttonView, common.marginTop50]}>
                    <TouchableOpacity
                        disabled={isEmpty(email) || isEmpty(password) || errorEmail || errorPassword ? true : false}
                        style={[common.button, (isEmpty(email) || isEmpty(password) || errorEmail || errorPassword) ? common.backColorGrey : common.backColorYellow]}
                        onPress={() => onLogin()}
                    >
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Log in')}</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={[styles.buttonView, common.marginTop25]}>
                    <TouchableOpacity style={styles.googleButton} onPress={() => alert(i18n.translate('Google Log in'))}>
                        <GoogleIcon />
                        <Text style={[styles.googleButtonText, common.fontColor444]}>{i18n.translate('Google Log in')}</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={common.height50} />
            </Content>
        </Container>
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
    labelView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
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
    rememberMe: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 40,
        width: '100%',
    },
    rememberText: {
        marginLeft: 10,
        fontSize: 16,
    },
    buttonView: {
        width: '100%',
        alignItems: 'center'
    },
    googleButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#C4C4C4'
    },
    googleButtonText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    }
});
