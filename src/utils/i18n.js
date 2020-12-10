import React from "react";
import { I18nManager } from "react-native";
import * as Localization from "react-native-localization";
import i18n from "i18n-js";

const en = require("@assets/languages/en");
const hu = require("@assets/languages/hu");
const ro = require("@assets/languages/ro");

const rtlLanguages = ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'];

const translate = (key, config) => {
    let msg = i18n.t(key, config)
    if (missingTranslationRegex.test(msg)) {
        msg = i18n.t(key, 'en')
    }
    return msg
}

const missingTranslationRegex = /^\[missing ".*" translation\]$/;

const setI18nConfig = () => {
    i18n.fallbacks = true
    i18n.translations = { en, hu, ro };
    i18n.defaultLocale = 'en'
    // I18nManager.forceRTL(false);
};

const setLocale = (locale = 'en') => {
    i18n.locale = locale
}

const getCurrentLocale = () => {
    return i18n.locale
}

const setDefaultLocale = (locale = 'en') => {
    i18n.defaultLocale = locale
}

const enableFallbacks = () => {
    i18n.fallbacks = true;
}

const getLocales = async () => {
    return await Localization.getLocales()
}

const isRTL = () => {
    const currLocale = i18n.locale
    let count = 0
    for (let i = 0; i < 12; i++) {
        if (rtlLanguages[i] == currLocale) {
            count = 1;
            break;
        }
    }
    if (count == 0) {
        // I18nManager.forceRTL(false);
        return false;
    } else {
        // I18nManager.forceRTL(true);
        return true;
    }
}

export default {
    enableFallbacks,
    setDefaultLocale,
    getCurrentLocale,
    setLocale,
    setI18nConfig,
    translate,
    getLocales,
    isRTL
}