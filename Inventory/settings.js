import * as React from 'react';
import { Text, View, Button, StyleSheet, AsyncStorage, header } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Constants from 'expo-constants';

import SettingsScreen from './settingshome';
import AddItems from './addItems';
import ChangePassScreen from './changepass';
import ChangeEmailScreen from './changeemail';

const SettingsStackNavigator = createStackNavigator({
  Settings: SettingsScreen,
  'Add Items': AddItems,
  'Change Password': ChangePassScreen,
  'Change Email': ChangeEmailScreen
},
{
  defaultNavigationOptions: {
    headerBackTitle: 'back'
  }
});

export default SettingsStackNavigator;