import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const themes = {
    LIGHT: {
        PRIMARY: '#FFFFFF',
        SECONDARY: '#DDDDDD'
    },
    DARK: {
        PRIMARY: '#000000',
        SECONDARY: '#555555'
    },
    BLUE: {
        PRIMARY: '#7FE2ED',
        SECONDARY: '#659FF8'
    },
    PINK: {
        PRIMARY: '#F382EB',
        SECONDARY: '#E62FC7'
    }
};

export const colors = {
    TRANSPARENT: 'transparent',
    WHITE: '#FFF',
    BLACK: '#000',
    RED: {
        DEFAULT: 'red',
        PRIMARY: '#EA4A4A',
    },
    GREEN: {
        DEFAULT: 'green',
        PRIMARY: '#45AB62',
    },
    BLUE: {
        DEFAULT: 'blue',
        PRIMARY: '#0386E1',
    },
    GREY: {
        DEFAULT: '#243235',
        PRIMARY: '#C4C4C4',
        SECONDARY: '#EFEFEF',
    },
    YELLOW: {
        DEFAULT: 'yellow',
        PRIMARY: '#F78F1E',
        C444: '$444444'
    }
}

export const common = StyleSheet.create({
    container: {
        flex: 1,
    },

    shown: {
        display: 'flex'
    },
    hidden: {
        display: 'none',
    },
    width10: {
        width: 10
    },
    width20: {
        width: 20
    },
    width30: {
        width: 30
    },
    width100P: {
        width: '100%'
    },

    height50: {
        height: 50
    },

    marginTop10: {
        marginTop: 10
    },
    marginTop25: {
        marginTop: 25
    },
    marginTop35: {
        marginTop: 35
    },
    marginTop50: {
        marginTop: 50,
    },
    marginLeftM20: {
        marginLeft: -20
    },

    borderWidth1D5: {
        borderWidth: 1.5
    },

    underLine: {
        textDecorationLine: 'underline'
    },

    flexRow: {
        flexDirection: 'row'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    headerLeft: {
        alignItems: 'flex-start',
        paddingLeft: 10,
        width: '20%'
    },
    headerLeftIcon: {
        width: 25,
        height: 25
    },
    headerTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%'
    },
    headerTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK,
        textAlign: 'center'
    },
    headerRight: {
        alignItems: 'flex-end',
        paddingRight: 10,
        width: '20%'
    },
    headerRightIcon: {
        width: 25,
        height: 25
    },
    headerRightText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY,
    },

    backColorYellow: {
        backgroundColor: colors.YELLOW.PRIMARY
    },
    backColorWhite: {
        backgroundColor: colors.WHITE
    },
    backColorGrey: {
        backgroundColor: colors.GREY.PRIMARY
    },

    fontWeightBold: {
        fontWeight: 'bold'
    },
    fontWeightNormal: {
        fontWeight: 'normal'
    },

    fontColorWhite: {
        color: colors.WHITE
    },
    fontColorBlack: {
        color: colors.BLACK
    },
    fontColorYellow: {
        color: colors.YELLOW.PRIMARY
    },
    fontColorRed: {
        color: colors.RED.PRIMARY
    },
    fontColorGrey: {
        color: colors.GREY.PRIMARY
    },
    fontColor444: {
        color: colors.GREY.C444
    },

    borderColorWhite: {
        borderColor: colors.WHITE
    },
    borderColorGrey: {
        borderColor: colors.GREY.PRIMARY
    },
    borderColorRed: {
        borderColor: colors.RED.PRIMARY
    },
    borderColorYellow: {
        borderColor: colors.YELLOW.PRIMARY
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

    errorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderColor: colors.RED.PRIMARY,
        borderRadius: 8,
        backgroundColor: '#F0505030',
        paddingLeft: 15,
        paddingRight: 20,
    },
    errorText: {
        marginTop: 5,
        marginHorizontal: 5,
        color: colors.RED.PRIMARY
    },
    iconText: {
        fontWeight: 'bold',
        color: '#F05050'
    },
});