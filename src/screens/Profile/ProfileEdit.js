import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setUser } from '@modules/reducers/auth/actions';
import { ProfileService } from '@modules/services';
import { isEmpty, validateName, validateEmail, validateMobile } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { ErrorIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default ProfileEdit = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [name, setName] = useState(props.route.params.userInfo.fullName);
    const [visitName, setVisitName] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [email, setEmail] = useState(props.route.params.userInfo.email);
    const [visitEmail, setVisitEmail] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [mobile, setMobile] = useState(isEmpty(props.route.params.userInfo.phoneNumber) ? '' : props.route.params.userInfo.phoneNumber);
    const [visitMobile, setVisitMobile] = useState(false);
    const [errorMobile, setErrorMobile] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setErrorMsg('');
        (visitName && isEmpty(name)) || (visitName && !validateName(name)) ? setErrorName('The name must be at least 3 characters long') : setErrorName('');
        (visitEmail && isEmpty(email)) || (visitEmail && !validateEmail(email)) ? setErrorEmail(i18n.translate('Email is not valid')) : setErrorEmail('');
        (visitMobile && isEmpty(mobile)) || (visitMobile && !validateMobile(mobile)) ? setErrorMobile(i18n.translate('Mobile is not valid')) : setErrorMobile('');
    }, [name, visitName, email, visitEmail, mobile, visitMobile]);

    const onSave = () => {
        dispatch(setLoading(true));
        ProfileService.modifyProfileInformation(user.token, name, email, mobile)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200) {
                    dispatch(setUser({
                        token: user.token,
                        email,
                        name,
                        city: user.city
                    }));
                    props.navigation.push('Success', { type: 2 });
                } else {
                    setErrorMsg(i18n.translate(response.msg));
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                props.navigation.push('Errors');
                setErrorMsg(error.message);
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
                    <Text style={common.headerTitleText}>{i18n.translate('Edit profile information')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity
                        disabled={isEmpty(name) || isEmpty(email) || isEmpty(mobile) || errorName || errorEmail || errorMobile || errorMsg}
                        onPress={() => onSave()}>
                        <Text style={(isEmpty(name) || isEmpty(email) || isEmpty(mobile) || errorName || errorEmail || errorMobile || errorMsg) ? [common.headerRightText, common.fontColorGrey] : common.headerRightText}>{i18n.translate('Set')}</Text>
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
                <View style={styles.inputView}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorName) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Name')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorName) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <TextField
                        keyboardType='default'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        value={name}
                        containerStyle={[styles.textContainer, !isEmpty(errorName) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={(value) => {
                            setName(value);
                            setVisitName(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorName}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop35]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('E-mail address')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <TextField
                        keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
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
                <View style={[styles.inputView, common.marginTop35]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelText, !isEmpty(errorMobile) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Phone number')}</Text>
                        <Text style={[styles.labelTextNormal, !isEmpty(errorMobile) ? common.fontColorRed : common.fontColorBlack]}> ({i18n.translate('Required')})</Text>
                    </View>
                    <TextField
                        autoCapitalize='none'
                        fontSize={16}
                        autoCorrect={false}
                        value={mobile}
                        containerStyle={[styles.textContainer, !isEmpty(errorMobile) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={(value) => {
                            setMobile(value);
                            setVisitMobile(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorMobile}</Text>
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
