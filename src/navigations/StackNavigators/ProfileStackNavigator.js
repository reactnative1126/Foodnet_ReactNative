import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import {
  Profile, ProfileEdit, ProfileDelete, ProfilePassword, 
  ReviewList, ReviewAdd, ReviewDelete,
  CouponCodes,
  Success, Errors
} from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackProfile = createStackNavigator();
export default ProfileStack = () => {
  return (
    <StackProfile.Navigator initialRouteName='Profile' screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackProfile.Screen name='Profile' component={Profile} options={navOptionHandler} />
      <StackProfile.Screen name='ProfileEdit' component={ProfileEdit} options={navOptionHandler} />
      <StackProfile.Screen name='ProfileDelete' component={ProfileDelete} options={navOptionHandler} />
      <StackProfile.Screen name='ProfilePassword' component={ProfilePassword} options={navOptionHandler} />

      <StackProfile.Screen name='ReviewList' component={ReviewList} options={navOptionHandler} />
      <StackProfile.Screen name='ReviewAdd' component={ReviewAdd} options={navOptionHandler} />
      <StackProfile.Screen name='ReviewDelete' component={ReviewDelete} options={navOptionHandler} />
      <StackProfile.Screen name='CouponCodes' component={CouponCodes} options={navOptionHandler} />

      <StackProfile.Screen name='Success' component={Success} options={navOptionHandler} />
      <StackProfile.Screen name='Errors' component={Errors} options={navOptionHandler} />
    </StackProfile.Navigator>
  )
}