import * as React from 'react';
import { Text, AsyncStorage, Button, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { } from 'react-navigation';
import Constants from 'expo-constants';

export default class SignUpScreen extends React.Component {
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
          email: '',
          password: '',
          password_confirmation: '',
          errors: [],
      }
  }
    checkErrors = () => {
      const errorsArray = [];
      if(!this.state.fullname.includes(' ')){
        errorsArray.push('must use full name: first + last');
      }
      if(this.state.fullname.includes('/')){
        errorsArray.push("cannot use '/' in name");
      }
      if(!(this.state.email.includes('@') && this.state.email.includes('.'))){
        errorsArray.push('must use valid email address');
      }
      if(!(this.state.password.length >= 7)){
        errorsArray.push('password must be at least 7 characters');
      }
      if(!(this.state.password===this.state.password_confirmation)){
        errorsArray.push('passwords do not match');
      }
      this.setState({errors: errorsArray});

    }
    _signUpAsync = async () => {
        await this.checkErrors();
        if(this.state.errors.length < 1){
          await AsyncStorage.setItem(this.state.fullname, JSON.stringify({password: this.state.password, email: this.state.email, checkouts: JSON.stringify([]), trans: JSON.stringify([])}));
          alert('sign up successful!');
          this.props.navigation.goBack();
        }
        
      };
    render() {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'lavender'}}>
            <View style={{alignItems: 'center', justifyContent: 'space-around', minHeight: 300, borderWidth: 1}}>
                <TextInput 
                        placeholder="full name"
                        onChangeText={(fullname) => this.setState({fullname})}
                        value={this.state.fullname}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{height: 50, width: 300, borderWidth: 1, borderColor: 'purple', borderRadius: 10, backgroundColor: 'white', fontSize: 20}}
                />
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{height: 50, width: 300, borderWidth: 1, borderColor: 'purple', borderRadius: 10, backgroundColor: 'white', fontSize: 20}}
                />
                <TextInput 
                    placeholder="create password"
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    style={{height: 50, width: 300, borderWidth: 1, borderColor: 'purple', borderRadius: 10, backgroundColor: 'white', fontSize: 20}}
                />
                <TextInput 
                    placeholder="confirm password"
                    onChangeText={(password_confirmation) => this.setState({password_confirmation})}
                    value={this.state.password_confirmation}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    style={{height: 50, width: 300, borderWidth: 1, borderColor: 'purple', borderRadius: 10, backgroundColor: 'white', fontSize: 20}}
                />
              <TouchableOpacity style={{backgroundColor: 'purple', borderRadius: 10}} onPress={this._signUpAsync}>
                <Text style={{padding: 10, fontSize: 30, color: 'white'}}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <Errors errors={this.state.errors}/>
          </View>
        </TouchableWithoutFeedback>
      );
    }
}
const Errors = (props) => {
    return (
      <View style={{borderWidth: 1, alignItems: 'center', width: '100%'}}>
        {props.errors.map((error, i) => <Text key={i} style={{color: 'red', paddingTop: 10}}> {error} </Text>)}
      </View>
    );
  }  /*try {
    let response = await fetch('https://afternoon-beyond-22141.herokuapp.com/api/users', {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          user: {
          fullname: this.state.fullname,
          email: this.state.email,
          password: this.state.password,
          password_confirmation: this.state.password_confirmation,
          }
      })
    })
    let res = await response.text();
    

    if(response.status >= 200 && response.status < 300){
      console.log('res is: ' + res);
    } else{
        let error = res;
        throw error;
    }
  } catch(errors) {
      //errors are in JSON form so we must parse them first.
      let formErrors = JSON.parse(errors);
      //We will store all the errors in the array.
      let errorsArray = [];
      for(var key in formErrors) {
        //If array is bigger than one we need to split it.
        if(formErrors[key].length > 1) {
            formErrors[key].map(error => errorsArray.push(`${key} ${error}`));
        } else {
            errorsArray.push(`${key} ${formErrors[key]}`);
        }
      }
      this.setState({errors: errorsArray})
      //this.setState({showProgress: false});
    }*/