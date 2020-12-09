import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { BackIcon, ErrorIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';
import CodeInput from 'react-native-code-input';
import CountDown from 'react-native-countdown-component';

export default Forgot = (props) => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [visitEmail, setVisitEmail] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [visible, setVisible] = useState(false);
    const [resend, setResend] = useState(false);
    const [code, setCode] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setErrorMsg('');
        (visitEmail && isEmpty(email)) || (visitEmail && !validateEmail(email)) ? setErrorEmail(i18n.translate('Email is not valid')) : setErrorEmail('');
    }, [email, visitEmail]);

    const onVerification = () => {
        dispatch(setLoading(true));
        AuthService.verification(email)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setVisible(true);
                    setResend(false);
                    setCode(response.result[0].reset_code);
                } else {
                    setVisible(true);
                    setResend(false);
                    setCode(123456);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setErrorMsg(error.message);
            });
    }

    const onFinishCheckingCode = (value) => {
        if (code == value) {
            props.navigation.navigate('Reset', { email, code })
        } else {
            setErrorMsg('Incorrect Code');
            setTimeout(() => setErrorMsg(''), 1500);
        };
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
                    <Text style={common.headerTitleText}>{i18n.translate('Forgotten Password')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                {!visible ?
                    <Fragment>
                        {isEmpty(errorMsg) ? (
                            <Text style={styles.descriptionText}>{i18n.translate('Please enter your email address to send us your new password')}</Text>
                        ) : (
                                <View style={common.errorContainer}>
                                    <ErrorIcon />
                                    <Text style={{ fontWeight: 'bold', color: '#F05050' }}>{errorMsg}</Text>
                                    <View style={{ width: 30 }} />
                                </View>
                            )}
                        <View style={styles.inputView}>
                            <Text style={[styles.labelText, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('E-mail')}</Text>
                            <TextField
                                disabled={visible}
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
                        <View style={[styles.buttonView, common.marginTop50]}>
                            <TouchableOpacity
                                disabled={isEmpty(email) || !isEmpty(errorEmail) || visible ? true : false}
                                style={[common.button, (isEmpty(email) || !isEmpty(errorEmail) || visible) ? common.backColorGrey : common.backColorYellow]}
                                onPress={() => onVerification()}
                            >
                                <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment> :
                    <Fragment>
                        <View style={styles.inputView}>
                            {isEmpty(errorMsg) ? (
                                <Fragment>
                                    <Text style={[styles.labelText, common.width100P]}>{i18n.translate('Confirm Verification Code')}</Text>
                                    <Text style={styles.confirmText}>{i18n.translate('If you do not receive the email, you can resend it in 45 seconds')}</Text>
                                </Fragment>
                            ) : (
                                    <View style={common.errorContainer}>
                                        <ErrorIcon />
                                        <Text style={{ fontWeight: 'bold', color: '#F05050' }}>{errorMsg}</Text>
                                        <View style={{ width: 30 }} />
                                    </View>
                                )}
                            <CodeInput
                                codeLength={6}
                                size={50}
                                secureTextEntry
                                activeColor={colors.YELLOW.PRIMARY}
                                inactiveColor={'#666'}
                                // autoFocus={false}
                                inputPosition='center'
                                containerStyle={common.marginTop35}
                                codeInputStyle={common.borderWidth1D5}
                                onFulfill={(value) => onFinishCheckingCode(value)}
                            />
                            {!resend && (
                                <View style={styles.countView}>
                                    <CountDown
                                        size={30}
                                        until={45}
                                        onFinish={() => setResend(true)}
                                        digitStyle={styles.digit}
                                        digitTxtStyle={styles.digitTxt}
                                        separatorStyle={styles.digitTxt}
                                        timeToShow={['M', 'S']}
                                        timeLabels={{ m: null, s: null }}
                                        showSeparator
                                    />
                                </View>)}
                            <View style={styles.bottomView}>
                                <TouchableOpacity disabled={resend ? false : true} style={[common.button, resend ? common.backColorYellow : common.backColorGrey]} onPress={() => onVerification()} >
                                    <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Resend')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[common.button, common.backColorYellow]} onPress={() => props.navigation.goBack()} >
                                    <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Fragment>}
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    descriptionText: {
        width: '80%',
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
        lineHeight: 24,
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
    countView: {
        width: '100%',
        paddingHorizontal: 10,
        alignItems: 'flex-end'
    },
    digit: {
        backgroundColor: '#FFF',
        width: 30,
        height: 30,
    },
    digitTxt: {
        fontSize: 15,
        color: '#666'
    },


    buttonView: {
        width: '100%',
        alignItems: 'center'
    },
    confirmView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    confirmText: {
        width: '100%',
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
        lineHeight: 24,
    },
    bottomView: {
        marginTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20
    }
});
