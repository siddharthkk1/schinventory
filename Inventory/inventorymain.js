import * as React from 'react';
import { Button, Animated, Text, View, StyleSheet, SectionList, TouchableOpacity, AsyncStorage, ActivityIndicator, FlatList } from 'react-native';
import { createStackNavigator, withNavigationFocus } from 'react-navigation';
import { ListItem, SearchBar } from 'react-native-elements';
import Constants from 'expo-constants';
import inventoryData from './inventorydata';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions } from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class Inventory extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarOptions: {
      visible: false,
    }

  }
  constructor(props){
    super(props);
    this.state = {
      removeMode: false ,
      inventory: {},
      loading: false,      
      data: [],      
      username: '',
      searchInv: {},
      error: null,
      active: false,
      value: '',
      arrayholder: [],
    }
    this.screenWidth = Math.round(Dimensions.get('window').width);
  }
  componentWillMount(){
    this.getInventoryData();
    this.getUserName();
  }
  changeRemoveMode = () => {
    this.setState(prevState=>({removeMode: !prevState.removeMode}));
}

  componentDidUpdate(prevProps) {
    if ((prevProps.isFocused !== this.props.isFocused) && this.props.isFocused) {
      this.getInventoryData();
      if(this.props.navigation.getParam('removeMode', 'o')===true){
        this.changeRemoveMode();
      }
    }
    if ((prevProps.isFocused !== this.props.isFocused) && !this.props.isFocused && this.state.removeMode) {
      this.handleRemoveModeDone();
    }
  }
  handleRemoveModeDone = () => {
    this.changeRemoveMode();
    this.props.navigation.setParams({removeMode: false});
  }
  getInventoryData = async() =>{
    //await AsyncStorage.setItem('//inventory', JSON.stringify(inventoryData));
    //await AsyncStorage.setItem('//inventory', JSON.stringify({}));
    //console.log(await AsyncStorage.getItem('//inventory'));
    //console.log(await AsyncStorage.multiGet(await AsyncStorage.getAllKeys()));
    let storedInventory = JSON.parse(await AsyncStorage.getItem('//inventory'));
    //console.log(await AsyncStorage.multiGet(AsyncStorage.getAllKeys()));
    if (storedInventory===null){
      storedInventory = {};
    }
    const keys = Object.keys(storedInventory);
    for(var i in keys){
      storedInventory[keys[i]]['pressed'] = false;
      storedInventory[keys[i]]['hideItems'] = true;
      storedInventory[keys[i]]['height'] = new Animated.Value(30);
    }
    await this.setState({inventory: storedInventory});
    //console.log(this.state.inventory)
  }
  getUserName = async() => {
    const username = await AsyncStorage.getItem('userToken');
    this.setState({username});
  }
  setChangedInventoryData = async() => {
    
    await AsyncStorage.setItem('//inventory', JSON.stringify(this.state.inventory));
  }
  changeSize = key => {
    const inventory = this.state.inventory;
    if(inventory[key].pressed){
      Animated.timing(
      inventory[key].height,
      {
        toValue: 30,
        duration: 200
      }).start();
    } else{
      Animated.timing(
      inventory[key].height,
      {
        toValue: 110,
        duration: 200
      }).start();
    }
  }
  changePressed = (key) => {
    const inventory = this.state.inventory;
    this.setState(prevState=>({
      inventory: {
        ...inventory,
        [key]: {
          ...inventory[key],
          pressed: !prevState.inventory[key].pressed,
          hideItems: !prevState.inventory[key].hideItems,

        }
      }
    }));
    
  }

  deleteItem(item){
    const inventory = this.state.inventory;
    delete inventory[item];
    this.setState({inventory});
    this.setChangedInventoryData();
  }
  handlePress = async(key) => {
    console.log(await AsyncStorage.multiGet(await AsyncStorage.getAllKeys()));
    await this.changeSize(key);
    this.changePressed(key);
    this.setChangedInventoryData();
  }
  handleCheckInPressed = async(item) => {
      const inventory = this.state.inventory;
      var now = new Date();
      var dateTime = now.getHours() + ':' + now.getMinutes() + ' ' + (now.getMonth()+1) + '/' + now.getDate() + '/' + now.getFullYear();
      inventory[item].transactions[0] = {...inventory[item].transactions[0], checkIn_Time: dateTime}
      await this.setState({inventory: {...inventory, [item]: {...inventory[item], checkedOut: false, checkedOut_Name: '', checkedOut_Loc: '', checkedOut_Time: '',
    }}});
      await AsyncStorage.setItem('//inventory', JSON.stringify(this.state.inventory));
      const username = await AsyncStorage.getItem('userToken');
      const userData = JSON.parse(await AsyncStorage.getItem(username));
      const checkouts = userData['checkouts'];
      checkouts.splice(checkouts.indexOf(item), 1);
      let trans = userData['trans'];
      for(var i in trans){
        if (trans[i]['item']===item){
          trans[i]['checkIn_Time'] = dateTime;
        }
      }
      await AsyncStorage.setItem(username, JSON.stringify({...userData, checkouts, trans}));
  }
  
  handleCheckOutPressed = (item) => {
    this.props.navigation.navigate('Checkout',{item: item, checkoutItem: this.checkoutItem});
  }
  checkoutItem = async(item, name, location, event, dateTime, duration) => {
    const inventory = this.state.inventory;  
    inventory[item].transactions.unshift({checkedOut_Name: name, checkedOut_Loc: location, checkedOut_Event: event, checkedOut_Time: dateTime, checkedOut_Duration: duration});
    await this.setState({inventory: {...inventory, [item]: {...inventory[item], 
        checkedOut: true,
        checkedOut_Name: name,
        checkedOut_Loc: location,
        checkedOut_Event: event,
        checkedOut_Time: dateTime,
        checkedOut_Duration: duration,
       }
    }});
    this.setChangedInventoryData();
  }
  goToTransactions = item => {
    const inventory = this.state.inventory
    this.props.navigation.navigate('Transactions', {transdata: inventory[item].transactions});
  }
  letterInventory(letter){
    const inventory = this.state.inventory; //object with properties of items (objects)
    const keysArray = Object.keys(this.order(inventory));
    
    const letterArray = [];
    keysArray.forEach(key=>{
      if(inventory[key].name.substring(0,1)===letter){
        letterArray.push(key);
      } else{
        return letterArray;
      }
    })
    return letterArray;
  }
  order = (obj) => {
    var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
        if (k1 < k2) return -1;
        else if (k1 > k2) return +1;
        else return 0;
    });

    var i, after = {};
    for (i = 0; i < keys.length; i++) {
      after[keys[i]] = obj[keys[i]];
      delete obj[keys[i]];
    }

    for (i = 0; i < keys.length; i++) {
      obj[keys[i]] = after[keys[i]];
    }
    return obj;
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = async(text) => {
    
    await this.setState({searchInv: this.state.inventory});
    const InvKeys = Object.keys(this.state.searchInv);
    const arr = [];
    for(var i in InvKeys){
      arr.push({key: i, name: InvKeys[i]});
    }
    await this.setState({searchInv: arr});
    await this.setState({
      value: text,
    });
    await this.setState({arrayholder: this.state.searchInv});
    const arrayholder = this.state.arrayholder;

    const newData = arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    this.setState({
      searchInv: newData,
      arrayholder: arrayholder
    });
    
  };

  handleChange = async(text) => {
    await this.searchFilterFunction(text);
    if(this.state.value===''||this.state.value===undefined){
      await this.setState({active: false});
    } else{
      await this.setState({active: true});
    }
  }
  renderHeader = () => {
    return (
        <SearchBar
          placeholder="Type Here..."
          lightTheme
          round
          onChangeText={text => this.handleChange(text)}
          autoCorrect={false}
          value={this.state.value}
        />
    );
  };

  goToItem = async(item) => {
    const inventory = this.state.inventory;
    this.setState({active: false});
    const itemLetter = item.substring(0,1);
    const sectionIndex = item.charCodeAt(0) - 65;
    const itemIndex = this.letterInventory(itemLetter).indexOf(item);
    this.sectionListRef.scrollToLocation({
      sectionIndex: sectionIndex,
      itemIndex: itemIndex,
    });
    //await this.setState({inventory: {...inventory, [item]: {...inventory[item], pressed: true}}});
    await this.changeSize(item);
    await this.changePressed(item);
  }

  render() {
    const inventory = this.state.inventory;
    const username = this.state.username;

    let doneButton = this.state.removeMode ? (
      <TouchableOpacity onPress = {this.handleRemoveModeDone} style={{backgroundColor: 'red', borderWidth: 3}}>
        <View style={{width: this.screenWidth, height: 50, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 40, color: 'white'}}>DONE</Text>
        </View>
      </TouchableOpacity>
        ) : (
          <View></View>);

      let searchbar = 
        <SearchBar
          placeholder="Type Here..."
          lightTheme
          round
          onChangeText={text => this.handleChange(text)}
          autoCorrect={false}
          value={this.state.value}
      />;

      if (this.state.loading) {
        searchbar = 
        (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>)
          }
      else if(this.state.active===true){
        searchbar =
          (<View style={{ maxHeight: '100%' }}>
            <FlatList
              data={this.state.searchInv}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={()=>this.goToItem(item.name)} >
                  <ListItem
                      title={item.name}
                    />
                </TouchableOpacity>
                )}
              keyExtractor={item => item.key}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
                />
              </View>)
          }
    
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 1, paddingTop: 22, width: '100%'}}>
          <View>{searchbar}</View>
          <SectionList
          ref={ref => (this.sectionListRef = ref)}
          extraData={this.state}
          sections={[
            {title: 'A', data: this.letterInventory('A')},
            {title: 'B', data: this.letterInventory('B')},
            {title: 'C', data: this.letterInventory('C')},
            {title: 'D', data: this.letterInventory('D')},
            {title: 'E', data: this.letterInventory('E')},
            {title: 'F', data: this.letterInventory('F')},
            {title: 'G', data: this.letterInventory('G')},
            {title: 'H', data: this.letterInventory('H')},
            {title: 'I', data: this.letterInventory('I')},
            {title: 'J', data: this.letterInventory('J')},
            {title: 'K', data: this.letterInventory('K')},
            {title: 'L', data: this.letterInventory('L')},
            {title: 'M', data: this.letterInventory('M')},
            {title: 'N', data: this.letterInventory('N')},
            {title: 'O', data: this.letterInventory('O')},
            {title: 'P', data: this.letterInventory('P')},
            {title: 'Q', data: this.letterInventory('Q')},
            {title: 'R', data: this.letterInventory('R')},
            {title: 'S', data: this.letterInventory('S')},
            {title: 'T', data: this.letterInventory('T')},
            {title: 'U', data: this.letterInventory('U')},
            {title: 'V', data: this.letterInventory('V')},
            {title: 'W', data: this.letterInventory('W')},
            {title: 'X', data: this.letterInventory('X')},
            {title: 'Y', data: this.letterInventory('Y')},
            {title: 'Z', data: this.letterInventory('Z')},
          ]}
          renderItem={({item, index}) => //item is key
            !this.state.removeMode ? (
            inventory[item].hideItems ? 
            (//normal item name rendered
              inventory[item].checkedOut ? (
                inventory[item].checkedOut_Name===username ? (
                  //item is checked out by user
                  <TouchableOpacity onPress={()=>this.handlePress(item)} activeOpacity={0.5}>
                      <Animated.View style={{backgroundColor: 'pink', borderWidth: 1, minHeight: inventory[item].height,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Text style={{paddingLeft: 10, fontSize: 20, fontWeight: '600'}}>{item}</Text>
                      <Button title="Check In" onPress={()=>this.handleCheckInPressed(item)}/>
                      </Animated.View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={()=>this.handlePress(item)} activeOpacity={0.5}>
                      <Animated.View style={{backgroundColor: 'gainsboro', borderWidth: 1, minHeight: inventory[item].height, justifyContent: 'center'}}>
                      <Text style={{paddingLeft: 10, fontSize: 20, fontWeight: '600'}}>{item}</Text>
                      </Animated.View>
                  </TouchableOpacity>
                  )
              ) : (
                <TouchableOpacity onPress={()=>this.handlePress(item)} activeOpacity={0.5}>
                      <Animated.View style={{backgroundColor: 'pink', borderWidth: 1, minHeight: inventory[item].height, justifyContent: 'center'}}>
                      <Text style={{paddingLeft: 10, fontSize: 20, fontWeight: '600'}}>{item}</Text>
                      </Animated.View>
                  </TouchableOpacity>
              )
              
            )
            :
            (//item is pressed 
                inventory[item].checkedOut ?
                (//checked out values shown
                    inventory[item].checkedOut_Name===username ? (
                      <TouchableOpacity onPress={()=>this.handlePress(item)} activeOpacity={0.5}>
                        <Animated.View style={{backgroundColor: 'pink', borderWidth: 1, minHeight: inventory[item].height}}>
                        <View style={{flex:1, justifyContent: 'center'}}><Text style={{paddingLeft: 10, fontSize: 20, fontWeight: '600'}}>{item}</Text></View>
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                          <View style={{backgroundColor: 'red', borderRadius: 5, margin: 3}}>
                            <Text style={{padding: 3, fontSize: 15, color: 'white'}}>{'default location: '+ inventory[item].default_location}</Text>
                          </View>
                          <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{padding: 3, fontSize: 15}}>{'Checked out by: YOU'}</Text>
                          </View>
                          <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{padding: 3,  fontSize: 15}}>{'for use in: '+ inventory[item].checkedOut_Loc}</Text>
                          </View>
                          <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{padding: 3, fontSize: 15}}>{'for event: '+ inventory[item].checkedOut_Event}</Text>
                          </View>
                          <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{padding: 3, fontSize: 15}}>{'@ '+ inventory[item].checkedOut_Time}</Text>
                          </View>
                          <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{padding: 3, fontSize: 15}}>{'for duration: '+ ((inventory[item].checkedOut_Duration===''|| inventory[item].checkedOut_Duration===undefined)? 'not given' : inventory[item].checkedOut_Duration)}</Text>
                          </View>
                        </View>
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button title="Transactions" onPress={()=>this.goToTransactions(item)}/>
                            <Button title="Check In" onPress={()=>this.handleCheckInPressed(item)}/>
                        </View>
                        </Animated.View>
                    </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={()=>this.handlePress(item)} activeOpacity={0.5}>
                        <Animated.View style={{backgroundColor: 'gainsboro', borderWidth: 1, minHeight: inventory[item].height}}>
                        <View style={{flex:1, justifyContent: 'center'}}><Text style={{paddingLeft: 10, fontSize: 20, fontWeight: '600'}}>{item}</Text></View>
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{backgroundColor: 'red', borderRadius: 5}}>
                              <Text style={{padding: 3, fontSize: 15, color: 'white'}}>{'default location: '+ inventory[item].default_location}</Text>
                            </View>
                            <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={{paddingLeft: 10, fontSize: 15}}>{'Checked out by: '+ inventory[item].checkedOut_Name}</Text>
                            </View>
                            <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={{paddingLeft: 10, fontSize: 15}}>{'for use in: '+ inventory[item].checkedOut_Loc}</Text>
                            </View>
                            <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{padding: 3, fontSize: 15}}>{'for event: '+ inventory[item].checkedOut_Event}</Text>
                          </View>
                            <View style={{backgroundColor: 'aquamarine', borderRadius: 5, margin: 1.25, minWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={{paddingLeft: 10, fontSize: 15}}>{'@ '+ inventory[item].checkedOut_Time}</Text>
                            </View>
                        </View>
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button title="Transactions" onPress={()=>this.goToTransactions(item)}/>
                            <Button title="Check Out" onPress={()=>this.handleCheckOutPressed(item)} disabled={true}/>
                        </View>
                        </Animated.View>
                    </TouchableOpacity>
                    )
                )
                :
                (//item not checked out yet
                <TouchableOpacity onPress={()=>this.handlePress(item)} activeOpacity={0.5}>
                <Animated.View style={{backgroundColor: 'pink', borderWidth: 1, minHeight: inventory[item].height}}>
                <View style={{flex:1, justifyContent: 'center'}}><Text style={{paddingLeft: 10, fontSize: 20, fontWeight: '600'}}>{item}</Text></View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: 'red', borderRadius: 5}}>
                      <Text style={{padding: 3, fontSize: 15, color: 'white'}}>{'default location: '+ inventory[item].default_location}</Text>
                    </View>
                </View>
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button title="Transactions" onPress={()=>this.goToTransactions(item)}/>
                    <Button title="Check Out" onPress={()=>this.handleCheckOutPressed(item)}/>
                </View>
                </Animated.View>
                </TouchableOpacity>
                )
            )) :
            (
              <View style={{backgroundColor: 'pink', borderWidth: 1, height: 40, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{paddingLeft: 18, fontSize: 20, fontWeight: '600'}}>{item}</Text>
                <TouchableOpacity onPress = {()=>this.deleteItem(item)} style={{paddingRight: 10}}>
                  <Icon name="minuscircle" size={18} color="red" />
                </TouchableOpacity>
              </View>
            )
            }
          renderSectionHeader={({section}) => 
              <Text style={{
                paddingTop: 2, paddingLeft: 10, paddingRight: 10, paddingBottom: 2, fontSize: 14, fontWeight: 'bold', 
                backgroundColor: 'rgba(246, 185, 3, 1.0)', borderWidth: 1
                }}>
                {section.title}
              </Text>
            }
          keyExtractor={(item, index) => index}
          />
        </View>
        <View>{doneButton}</View>
      </View>
    );
  }
}
export default withNavigationFocus(Inventory);
