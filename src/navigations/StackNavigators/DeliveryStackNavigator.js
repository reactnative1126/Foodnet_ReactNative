import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import {
  DeliveryList, DeliveryAdd,
  Success, Errors
} from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackDelivery = createStackNavigator();
export default DeliveryStack = () => {
  return (
    <StackDelivery.Navigator initialRouteName='DeliveryList' screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackDelivery.Screen name='DeliveryList' component={DeliveryList} options={navOptionHandler} />
      <StackDelivery.Screen name='DeliveryAdd' component={DeliveryAdd} options={navOptionHandler} />
      <StackDelivery.Screen name='Success' component={Success} options={navOptionHandler} />
      <StackDelivery.Screen name='Errors' component={Errors} options={navOptionHandler} />
    </StackDelivery.Navigator>
  )
}