import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import {
  Profile, DeliveryList, DeliveryAdd, DeliverySuccess, DeliveryError,
  ProfileEdit, ProfileDelete, PasswordChange, ReviewList, ReviewAdd, ReviewDelete,
  CouponCodes
} from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackProfile = createStackNavigator();
export default ProfileStack = () => {
  return (
    <StackProfile.Navigator initialRouteName='Profile'
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackProfile.Screen name='Profile' component={Profile} options={navOptionHandler} />
      <StackProfile.Screen name='DeliveryList' component={DeliveryList} options={navOptionHandler} />
      <StackProfile.Screen name='DeliveryAdd' component={DeliveryAdd} options={navOptionHandler} />
      <StackProfile.Screen name='DeliverySuccess' component={DeliverySuccess} options={navOptionHandler} />
      <StackProfile.Screen name='DeliveryError' component={DeliveryError} options={navOptionHandler} />
      <StackProfile.Screen name='ProfileEdit' component={ProfileEdit} options={navOptionHandler} />
      <StackProfile.Screen name='ProfileDelete' component={ProfileDelete} options={navOptionHandler} />
      <StackProfile.Screen name='PasswordChange' component={PasswordChange} options={navOptionHandler} />
      <StackProfile.Screen name='ReviewList' component={ReviewList} options={navOptionHandler} />
      <StackProfile.Screen name='ReviewAdd' component={ReviewAdd} options={navOptionHandler} />
      <StackProfile.Screen name='ReviewDelete' component={ReviewDelete} options={navOptionHandler} />
      <StackProfile.Screen name='CouponCodes' component={CouponCodes} options={navOptionHandler} />
    </StackProfile.Navigator>
  )
}