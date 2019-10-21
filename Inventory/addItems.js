import * as React from 'react';
import { FlatList, Button, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AsyncStorage, Animated} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/AntDesign';
import ChangePassScreen from './changepass';
//I commented out require('console') because it was annoying and auto importing







export default class AddItems extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      nextKeyVal: '1',
      keys: [{key: '0'}],
      inventoryAddition: {'0': {}},
      maxHeight: 450
    }
  }
  static navigationOptions = {
    title: 'Add Items'
  }
  componentWillMount(){
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
  }
  componentWillUnmount(){
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({maxHeight: 280});
  }
  _keyboardDidHide = () => {
    this.setState({maxHeight: 450});
  }
  addEntry = () => {
    let newData = this.state.keys;
    newData.push({key: this.state.nextKeyVal});
    this.setState(prevState=>({inventoryAddition: {...this.state.inventoryAddition, [this.state.nextKeyVal]: {}}, nextKeyVal: ''+(1 + parseInt(prevState.nextKeyVal)), keys: newData}));
  }
  allFieldsFilled = () => {
    const {inventoryAddition} = this.state;
    const keys = Object.keys(inventoryAddition);
    for(var i in keys){
      if(inventoryAddition[keys[i]]['name']=== undefined || inventoryAddition[keys[i]]['name']=== ''){
        return false;
      }
      if(inventoryAddition[keys[i]]['default_location']=== undefined || inventoryAddition[keys[i]]['default_location']=== ''){
        return false;
      }
    }
    return true;
  }
  allItemsNew = async() => {
    const {inventoryAddition} = this.state;
    const keys = Object.keys(inventoryAddition);
    const inventory = JSON.parse(await AsyncStorage.getItem('//inventory'));
    
    let inventoryKeys;
    inventory === null ? inventoryKeys = [] :  inventoryKeys = await Object.keys(inventory);
    for(var i in keys){
      if(inventoryKeys.includes(inventoryAddition[keys[i]]['name'])){
        return inventoryAddition[keys[i]]['name'];
      }
    }
    return true;
  }
  removeDoneItems = () => {
    this.setState({nextKeyVal: '1', keys: [{key: '0'}], inventoryAddition: {'0': {}}});
  }
  addItems = async() => {
    console.log('ogg');
    const {inventoryAddition} = this.state;
    const keys = Object.keys(inventoryAddition);
    let changedInventory = JSON.parse(await AsyncStorage.getItem('//inventory'));
    if(changedInventory===null){
      changedInventory = {};
    }
    let inventoryObject = {};
    const allItemsNew = await this.allItemsNew();
    if(this.allFieldsFilled()){
        if(allItemsNew===true){
        for(var i in keys){
          inventoryObject = { 
            name: inventoryAddition[keys[i]]['name'], 
            default_location: inventoryAddition[keys[i]]['default_location'],
            transactions: [],
            pressed: false,
            height: new Animated.Value(30),
            hideItems: true,
            checkedOut: false,
          };
          changedInventory = {...changedInventory, [inventoryAddition[keys[i]]['name']]: inventoryObject};
        }
      await AsyncStorage.setItem('//inventory', JSON.stringify(changedInventory));
      this.removeDoneItems();
        } else{
          alert(`item '${allItemsNew}' already exists`);
        }
    } else{
      console.log('yoga');
      alert('not all fields are filled');
    }
  }
  deleteItem = (key) => {
    const keys = this.state.keys;
    for(var i in keys){
      if(keys[i]['key']===key){
        keys.splice(i,1);
      }
    }
    delete this.state.inventoryAddition[key];
    this.setState({keys});
  }
  render() {
    const inventoryAddition = this.state.inventoryAddition;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View style={{width: '100%', maxHeight: this.state.maxHeight}}>
          <FlatList
            data={this.state.keys}
            renderItem={({item, index}) => (
            <View style={{height: 75, borderWidth: 1, backgroundColor: 'lavender', flexDirection: 'row'}}>
              <View style={{flex: 7, height: '100%', justifyContent: 'space-evenly', alignItems: 'center'}}>
              <TextInput
                placeholder="item name"
                value={this.state.inventoryAddition[item.key]['name']}
                onChangeText={(text) => this.setState({inventoryAddition: {...inventoryAddition, [item.key]: {...inventoryAddition[item.key], name: text} }})}
                style={{height: 25, width: 200, borderWidth: 1}}/>
              <TextInput
                placeholder="default location"
                value={this.state.inventoryAddition[item.key]['default_location']}
                onChangeText={(text) => this.setState({inventoryAddition: {...inventoryAddition, [item.key]: {...inventoryAddition[item.key], default_location: text} }})}
                style={{height: 25, width: 200,  borderWidth: 1}}/>
                </View>
                <View style={{flex:1, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=> this.deleteItem(item.key)}>
                  <Icon name="minuscircle" size={25} color="red" />
                </TouchableOpacity>
                </View>
            </View>
            )}
            extraData={this.state}
          />
          </View>
          <TouchableOpacity style={{width: 42, marginVertical: 5,}} onPress= {this.addEntry}>
            <Icon name="pluscircle" size={40} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress= {this.addItems} style={{backgroundColor: 'purple', borderRadius: 15}}>
            <Text style={{color: 'white', fontSize: 25, paddingHorizontal: 10, paddingVertical: 4}}>add all items</Text>
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
    );
  }
}