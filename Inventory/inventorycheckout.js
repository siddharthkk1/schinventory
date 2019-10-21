import * as React from 'react';
import { Button, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, AsyncStorage} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Constants from 'expo-constants';


export default class Checkout extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loc: '',
      duration: '',
      event: ''
    }
  }
  static navigationOptions = {
    title: 'Check Out'
  }

  handleEnter = async() => {
    if(this.state.loc!== ''){
        var now = new Date();
        var dateTime = now.getHours() + ':' + now.getMinutes() + ' ' + (now.getMonth()+1) + '/' + now.getDate() + '/' + now.getFullYear();
        
        const name = await AsyncStorage.getItem('userToken');
        this.props.navigation.state.params.checkoutItem(this.props.navigation.getParam('item'), name, this.state.loc, this.state.event, dateTime, this.state.duration);

        const userData = (JSON.parse(await AsyncStorage.getItem(name)))
        //console.log(userData);
        let checkouts;
        userData['checkouts']==='[]' ? checkouts = JSON.parse(userData['checkouts']) : checkouts = userData['checkouts'];
        let transArray; 
        userData['trans']==='[]' ? transArray = JSON.parse(userData['trans']) : transArray = userData['trans'];
        checkouts.push((this.props.navigation.getParam('item')));
        transArray.unshift({
          item: this.props.navigation.getParam('item'),
          checkedOut_Loc: this.state.loc,
          checkedOut_Event: this.state.event,
          checkedOut_Time: dateTime,});

        await AsyncStorage.setItem(name, JSON.stringify({...userData, checkouts: checkouts, trans: transArray}));
        
        this.setState({loc:'', duration: '', event: ''});
        this.props.navigation.navigate('Inventory Main');
    }
  }
  render() {
    const inventory = this.state.inventory;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex:1, justifyContent: 'space-around', alignItems: 'center'}}>
          <Text style={{fontSize: 30}}>{this.props.navigation.getParam('item','no item')}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <Text>{'Location for use: '}</Text>
            <TextInput 
              onChangeText={(loc) => this.setState({loc})}
              value={this.state.loc}
              style={{borderWidth: 1, minWidth: 100, height: 30}}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <Text>{'Event: '}</Text>
            <TextInput 
              onChangeText={(event) => this.setState({event})}
              value={this.state.event}
              style={{borderWidth: 1, minWidth: 100, height: 30}}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <Text>{'Duration (optional): '}</Text>
            <TextInput 
              onChangeText={(duration) => this.setState({duration})}
              value={this.state.duration}
              style={{borderWidth: 1, minWidth: 100, height: 30}}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <Button title='enter' onPress={this.handleEnter}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}