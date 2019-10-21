import * as React from 'react';
import { Button, Animated, Text, View, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Constants from 'expo-constants';



export default class Transactions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      transdata: this.props.navigation.getParam('transdata')
    }
  }
  static navigationOptions = {
    title: 'Transactions'
  }

  render() {
    const inventory = this.state.inventory;
    const colorArray = ['cyan', 'chartreuse', 'salmon', 'lavender']
    return (
      <View style={{flex:1}}>
        <FlatList
          data={this.state.transdata}
          renderItem={({item, index}) => (
          <View style={{borderWidth: 1, minHeight: 75, justifyContent: 'center', paddingLeft: 10, backgroundColor: colorArray[index%4]}}>
            <Text>checked out by: {item.checkedOut_Name}</Text>
            <Text>   use location: {item.checkedOut_Loc}</Text>
            <Text>   for event: {item.checkedOut_Event}</Text>
            <Text>   @: {item.checkedOut_Time}</Text>
            <Text>{item.checkIn_Time===undefined ? 'check in pending' : 'checked in @ ' + item.checkIn_Time}</Text>
          </View>)}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>
    );
  }
}