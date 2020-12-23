import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { Cart, CartDetail } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackOrder = createStackNavigator();
export default OrderStack = () => {
  return (
    <StackOrder.Navigator initialRouteName='Cart'
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackOrder.Screen name='Cart' component={Cart} options={navOptionHandler} />
      <StackOrder.Screen name='CartDetail' component={CartDetail} options={navOptionHandler} />
    </StackOrder.Navigator>
  )
}