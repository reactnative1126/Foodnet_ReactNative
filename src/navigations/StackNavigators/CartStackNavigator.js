import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { CartIndex, CartDetail } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackCart = createStackNavigator();
export default CartStack = () => {
  return (
    <StackCart.Navigator initialRouteName='CartIndex'
      screenOptions={{ gestureEnabled: false, ...TransitionPresets.SlideFromRightIOS }}>
      <StackCart.Screen name='CartIndex' component={CartIndex} options={navOptionHandler} />
      <StackCart.Screen name='CartDetail' component={CartDetail} options={navOptionHandler} />
    </StackCart.Navigator>
  )
}