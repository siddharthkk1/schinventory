import * as React from 'react';
import { Text, View, Button, StyleSheet, AsyncStorage, header, TextInput} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Constants from 'expo-constants';


export default class SettingsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          username: '',
          adminMode: false,
          input: '',
          version: undefined,
        }
    }

    componentWillMount() {
      this._setUser()
    }

    _setUser = async () => {
      await AsyncStorage.setItem('admin password', 'sch123');
        const username = await AsyncStorage.getItem('userToken');
        const userData = JSON.parse(await AsyncStorage.getItem(username))
        //console.log(userData);
        const email = userData['email']; //email is 2nd value in user data array;
        this.setState({username, email});
    }
    changeAdminMode = (version) => {
      this.setState(prevState=>({adminMode: !prevState.adminMode, version: version, input: ''}));
    }
    checkPassword = async() => {

      const pass = await AsyncStorage.getItem('admin password');
      if(this.state.input===pass){
        this.grantAccess();
      } else{
        alert('incorrect admin password');
        this.setState({input: ''});
      }
    }
    grantAccess = () => {
      if(this.state.version==='add'){
        this.moveToAddItems();
      } else if(this.state.version==="remove"){
        this.removeMode();
      }
      this.changeAdminMode();
    }
    moveToAddItems = () => {
      this.props.navigation.navigate('Add Items');
    }
    removeMode = async() => {
      //await AsyncStorage.setItem('removeMode', true);
      this.props.navigation.navigate('Inventory Main', {removeMode: true});
    }
    _signOutAsync = async () => {
      await AsyncStorage.removeItem('userToken');
      this.props.navigation.navigate('Auth');
    };


    render() {
      return (
          !this.state.adminMode ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 30}}>{this.state.username}</Text>
              <Text style={{fontSize: 20, color: 'salmon'}}>{this.state.email}</Text>
              <Button title="Add Items" onPress={()=>this.changeAdminMode('add')}/>
              <Button title="Remove Items" onPress={()=>this.changeAdminMode('remove')} />
              <Button title="Change Password" onPress={() => this.props.navigation.navigate('Change Password')}/>
              <Button title="Change Email" onPress={() => this.props.navigation.navigate('Change Email', {setUser: this._setUser})} />
              <Button title="Sign Out" onPress={this._signOutAsync} />
            </View>
          ) :
          (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{height: 200, width: 300, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'tomato'}}>
              <Text style={{fontSize: 30}}>enter admin password</Text>
              <TextInput 
              placeholder="password" secureTextEntry={true}
              autoCapitalize="none" autoCorrect={false} 
              value={this.state.input} onChangeText= {(input)=>this.setState({input})} 
              style={{height: 30, width: 150, borderWidth: 1, borderColor: 'blue', color: 'white'}}
              />
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Button title="go back" onPress={this.changeAdminMode}/>
                <Button title="enter" onPress={this.checkPassword}/>
              </View>
            </View>
          </View>
          )
        
      );
    }
  
}