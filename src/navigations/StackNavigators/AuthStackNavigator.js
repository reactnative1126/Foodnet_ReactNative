import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { SignIn, SignUp, Forgot, Reset } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackAuth = createStackNavigator();
export default AuthStack = () => {
  return (
    <StackAuth.Navigator initialRouteName='SignIn'
      screenOptions={{ gestureEnabled: false, ...TransitionPresets.SlideFromRightIOS }}>
      <StackAuth.Screen name='SignIn' component={SignIn} options={navOptionHandler} />
      <StackAuth.Screen name='SignUp' component={SignUp} options={navOptionHandler} />
      <StackAuth.Screen name='Forgot' component={Forgot} options={navOptionHandler} />
      <StackAuth.Screen name='Reset' component={Reset} options={navOptionHandler} />
    </StackAuth.Navigator>
  )
}
