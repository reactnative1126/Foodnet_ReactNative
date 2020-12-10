import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import NetInfo from '@react-native-community/netinfo';
import i18n from '@utils/i18n';

import { Internet, Start, Cities, Languages } from '@screens';
import { Loading } from '@components';
import DrawerNavigator from '@navigations/DrawerNavigator';
import AuthStack from '@navigations/StackNavigators/AuthStackNavigator';
import { navOptionHandler } from '@utils/functions';

const StackApp = createStackNavigator();
export default AppContainer = () => {
    const { logged, country, city, user } = useSelector(state => state.auth);
    i18n.setLocale(country);

    useEffect(() => {
        const handleEventListener = state => {
            if (!state.isConnected && navigator && global.internet) {
                global.internet = false;
                navigator.dispatch(StackActions.push('Internet'));
            }
            if (state.isConnected && navigator && !global.internet) {
                global.internet = true;
                navigator.dispatch(StackActions.pop());
            }
        }
        const unsubscribe = NetInfo.addEventListener(state => handleEventListener(state));
        return () => unsubscribe();
    }, []);

    return (
        <Fragment>
            <NavigationContainer ref={nav => navigator = nav}>
                <StackApp.Navigator
                    initialRouteName={user.city.status ? 'Cities' : (logged || city.id !== 0) ? 'App' : 'Start'}
                    screenOptions={{ gestureEnabled: false, ...TransitionPresets.SlideFromRightIOS }}>
                    <StackApp.Screen name='Internet' component={Internet} options={{ headerShown: false, animationEnabled: false }} />
                    <StackApp.Screen name='Start' component={Start} options={navOptionHandler} />
                    <StackApp.Screen name='Auth' component={AuthStack} options={navOptionHandler} />
                    <StackApp.Screen name='Cities' component={Cities} options={navOptionHandler} />
                    <StackApp.Screen name='Languages' component={Languages} options={navOptionHandler} />
                    <StackApp.Screen name='App' component={DrawerNavigator} options={navOptionHandler} />
                </StackApp.Navigator>
            </NavigationContainer>
            <Loading />
        </Fragment>
    );
}