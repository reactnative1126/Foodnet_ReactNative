import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { NAME_PATTERN, EMAIL_PATTERN, PASSWORD_PATTERN, ALIAS_PATTERN, MOBILE_PATTERN } from '@constants/regexs';

export const navOptionHandler = () => ({
    headerShown: false,
    animationEnabled: true,
    // gestureEnabled: true
});

export const validateName = (value) => {
    if (value.length >= 3 && value.length <= 20) {
        return true;
    }
    return false;
}

export const validateEmail = (value) => {
    if (EMAIL_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validateMobile = (value) => {
    if (MOBILE_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validatePassword = (value) => {
    if (PASSWORD_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validateAlias = (value) => {
    if (ALIAS_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validateLength = (value, length) => {
    if (value.length >= length) {
        return true;
    }
    return false;
}

export const isEmpty = (param) => {
    return param == undefined || param == null || (typeof param === 'string' && param == '') || (typeof param === 'object' && param.length == 0) || (typeof param === 'array' && param.length == 0);
}

export function SendPushNotification(token, title, body, data) {
    axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        },
        data: {
            to: token,
            notification: {
                title: title,
                body: body,
                data: data
            }
        },
    }).then((response) => {
        console.log(response);
    });
}