import * as React from 'react';
import { } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator  } from 'react-navigation';

import * as firebase from 'firebase';


import ApiKeys from './constants/ApiKeys';


import SignInScreen from './signin';
import SignUpScreen from './signup';
import SettingsStackNavigator from './settings';
import InventoryStackNavigator from './inventory';
import AuthLoadingScreen from './authloading';
import HistoryScreen from './history';


const AuthStack = createStackNavigator({ SignIn: SignInScreen, SignUp: SignUpScreen });
const AppTabNavigator = createBottomTabNavigator({
  Inventory: InventoryStackNavigator,
  History: HistoryScreen,
  Settings: SettingsStackNavigator,
  

})

const AppContainer =  createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppTabNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends React.Component {
  constructor(props){
    super(props);
    if(!firebase.apps.length) {firebase.initializeApp(ApiKeys.FirebaseConfig); };
  }

  render() {
      return <AppContainer/>
  }
}