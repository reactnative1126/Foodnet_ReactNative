import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { OrderIndex, OrderDetail } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackOrder = createStackNavigator();
export default OrderStack = () => {
  return (
    <StackOrder.Navigator initialRouteName='OrderIndex'
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackOrder.Screen name='OrderIndex' component={OrderIndex} options={navOptionHandler} />
      <StackOrder.Screen name='OrderDetail' component={OrderDetail} options={navOptionHandler} />
    </StackOrder.Navigator>
  )
}