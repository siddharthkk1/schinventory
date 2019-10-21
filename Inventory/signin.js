import * as React from 'react';
import { Text, AsyncStorage, Button, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { } from 'react-navigation';
import Constants from 'expo-constants';

const ACCESS_TOKEN = 'access_token';
export default class SignInScreen extends React.Component {
    static navigationOptions = {
      title: 'Please sign in',
      headerStyle: {
        backgroundColor: 'purple'
      }
    };
    constructor(props){
      super(props);
      this.state= {
          fullname: '',
          password: '',
          error: ''
      }
  } 

    storeToken = async(accessToken) => {
      try{
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
        this.getToken();
      } catch(error) {
        console.log('something went wrong');
      }
    }
    getToken = async() => {
      try{
        let token = await AsyncStorage.getItem(ACCESS_TOKEN);
        console.log('token is: '+ token);
      } catch(error) {
        console.log('something went wrong');
      }
    }
    getUserPassword = async(fullname, userNameArray, userDataArray) => {
        for (let i=0; i<userDataArray.length;i++){
          if (userDataArray[i][0]===fullname){
            const userData = JSON.parse(userDataArray[i][1]);
            return userData['password'];//the user's password
          }
        }
        return 'error';
      } 

    _signInAsync = async () => {
        const {fullname, password} = this.state;
        if(!(fullname==='' || password==='')){
          const userNameArray = await AsyncStorage.getAllKeys();
          const userDataArray = await AsyncStorage.multiGet(userNameArray);
          let userPassword;
          
          if(userNameArray.includes(fullname)){
            userPassword = await this.getUserPassword(fullname, userNameArray, userDataArray);
            if(password===userPassword){
              await AsyncStorage.setItem('userToken', fullname);
              this.props.navigation.navigate('App');
            } else{
              alert('incorrect password for given name');
            }
          } else{
            alert('no account exists with that name   :(');
          }
        } else{
          alert('name or password cannot be blank')
        }
        
      }
    moveToSignUp = () => {
      this.props.navigation.navigate('SignUp');
    }
    render() {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'lavender'}}>
            <View style={{alignItems: 'center', justifyContent: 'space-around', height: 300, borderWidth: 1}}>
                <TextInput 
                        placeholder="full name"
                        onChangeText={(fullname) => this.setState({fullname})}
                        value={this.state.fullname}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{height: 50, width: 300, borderWidth: 1, borderColor: 'purple', borderRadius: 10, backgroundColor: 'white', fontSize: 20}}
                />
                <TextInput 
                    placeholder="password"
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    style={{height: 50, width: 300, borderWidth: 1, borderColor: 'purple', borderRadius: 10, backgroundColor: 'white', fontSize: 20}}
                />
              <TouchableOpacity style={{backgroundColor: 'purple', borderRadius: 10}} onPress={this._signInAsync}>
                <Text style={{padding: 10, fontSize: 30, color: 'white'}}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: 'blue', borderRadius: 10}} onPress={this.moveToSignUp}>
                <Text style={{padding: 10, fontSize: 20, color: 'white'}}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
}
  /*if(this.state.fullname!==''&&this.state.password!==''){
        await AsyncStorage.setItem(this.state.fullname, this.state.password);
        //this.setState({username: '', password: ''})
        this.props.navigation.navigate('App');
      }
      //try {
        /*let response = await fetch('https://afternoon-beyond-22141.herokuapp.com/api/login', {
                                method: 'POST',
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  session:{
                                    fullname: this.state.fullname,
                                    password: this.state.password,
                                  }
                                })
                              });
        let res = await response.text();
        //if (response.status >= 200 && response.status < 300) {
            //Handle success
            this.setState({error: ''});
            let accessToken = this.state.fullname;//res;
            this.storeToken(accessToken);
            console.log('res token: '+accessToken);
            //On success we will store the access_token in the AsyncStorage
           
            //this.redirect('home');
        } else {
            //Handle error
            let error = res;
            throw error;
        }
      } catch(error) {
            this.setState({error: error});
            console.log("error: " + error);
            this.setState({showProgress: false});
        }*/