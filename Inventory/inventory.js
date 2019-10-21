import * as React from 'react';
import { Button, Animated, Text, View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Constants from 'expo-constants';

import Inventory from './inventorymain';
import Transactions from './inventorytrans';
import Checkout from './inventorycheckout';

const InventoryStackNavigator = createStackNavigator({
  'Inventory Main': Inventory,
  Checkout: Checkout,
  Transactions: Transactions,
  
},
{
  defaultNavigationOptions: {
    headerBackTitle: 'back'
  }
});
export default InventoryStackNavigator;