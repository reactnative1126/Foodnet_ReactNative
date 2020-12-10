import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import Toast from 'react-native-simple-toast';
import CodeInput from 'react-native-code-input';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setToken } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail } from '@utils/functions';
import { themes, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { BackIcon, GoogleIcon } from '@constants/svgs';
import i18n from '@utils/i18n';
import { color } from 'react-native-reanimated';

export default Forgot = (props) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [visible, setVisible] = useState(false);

    // const dispatch = useDispatch();

    useEffect(() => {
        isEmpty(email) ? setErrorEmail('Email is required') : !validateEmail(email) ? setErrorEmail('Email is not valid') : setErrorEmail('');
    }, [email])

    const onForgot = async () => {
        if (!isEmpty(email) && isEmpty(errorEmail)) {
            setVisible(true);
        }
    }

    return (
        <Container style={styles.container}>
            <StatusBar />
            <Loading loading={loading} />
            <Header style={styles.header}>
                <Left style={{ paddingLeft: 10 }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <BackIcon style={styles.backIcon} />
                    </TouchableOpacity>
                </Left>
                <Title>
                    <Text style={styles.titleText}>{i18n.translate('Forgotten Password')}</Text>
                </Title>
                <Right style={{ paddingRight: 10 }} />
            </Header>
            <Content style={styles.content}>
                <Text style={styles.descriptionText}>{i18n.translate('Please enter your email address to send us your new password')}</Text>
                <View style={styles.inputView}>
                    <Text style={styles.labelText}>{i18n.translate('E-mail')}</Text>
                    <TextField
                        keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={email}
                        error={errorEmail}
                        containerStyle={[styles.textContainer, { borderColor: !isEmpty(errorEmail) ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={(value) => setEmail(value)}
                    />
                </View>
                <View style={[styles.buttonView, { marginTop: 35 }]}>
                    <TouchableOpacity
                        disabled={isEmpty(email) || !isEmpty(errorEmail) ? true : false}
                        style={[styles.button, {
                            backgroundColor: isEmpty(email) || !isEmpty(errorEmail) ? colors.GREY.PRIMARY : colors.YELLOW.PRIMARY
                        }]}
                        onPress={() => onForgot()}
                    >
                        <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Save')}</Text>
                    </TouchableOpacity>
                </View>
                <CodeInput
                    codeLength={6}
                    size={50}
                    secureTextEntry
                    activeColor={colors.YELLOW.PRIMARY}
                    inactiveColor={colors.YELLOW.PRIMARY}
                    // autoFocus={false}
                    inputPosition='center'
                    containerStyle={{ marginTop: 30 }}
                    codeInputStyle={{ borderWidth: 1.5 }}
                    onFulfill={(code) => onFinishCheckingCode(code)}
                />
            </Content>
            {/* <Verification visible={true} navigation={props.navigation} /> */}
        </Container>
    );
}

const Verification = (props) => {

    const onFinishCheckingCode = async () => {
        props.navigation.navigate('Reset');
    }

    return (
        <View style={[styles.confirmView, { display: props.visible ? 'flex' : 'none' }]}>
            <View style={styles.opacityView} />
            <View style={styles.confirmModal}>
                <Text style={styles.confirmTitle}>Verification Code</Text>
                <Text style={styles.confirmDescription}>A message with a verification code has been sent to your email for reset password. Enter the code to continue.</Text>
                <CodeInput
                    codeLength={6}
                    size={50}
                    secureTextEntry
                    activeColor={colors.YELLOW.PRIMARY}
                    inactiveColor={colors.YELLOW.PRIMARY}
                    // autoFocus={false}
                    inputPosition='center'
                    containerStyle={{ marginTop: 0 }}
                    codeInputStyle={{ margin: 1, width: 20, borderBottomWidth: 1.5 }}
                    onFulfill={(code) => onFinishCheckingCode(code)}
                />
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Didn't Get a Code</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    backIcon: {
        width: 25,
        height: 25
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
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
    buttonView: {
        width: '100%',
        alignItems: 'center'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmView: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    opacityView: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080'
    },
    confirmModal: {
        alignItems: 'center',
        width: 300,
        height: 300,
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    confirmTitle: {
        marginTop: 30,
        fontSize: 16,
        fontWeight: 'bold'
    },
    confirmDescription: {
        marginTop: 10,
        width: '80%',
        textAlign: 'center'
    },
    confirmButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.GREY.PRIMARY
    },
    confirmText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    }
});
