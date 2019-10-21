import * as React from 'react';
import {TextInput, Button, AsyncStorage, View, Keyboard, Text, TouchableWithoutFeedback} from 'react-native';

export default class ChangePassScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            prevPass: '',
            newPass: '',
            confPass: '',
            errors: [],
        }
    }

    checkErrors = (pass) => {
        const errorsArray = [];
        if(!(pass === this.state.prevPass)){
          errorsArray.push('previous password does not match');
        }
        if(!(this.state.newPass.length >= 7)){
          errorsArray.push('password must be at least 7 characters');
        }
        if(!(this.state.newPass===this.state.confPass)){
          errorsArray.push('new passwords do not match');
        }
        this.setState({errors: errorsArray});
  
      }

    handleEnter = async() => {
        const user = await AsyncStorage.getItem('userToken');
        let userData = JSON.parse(await AsyncStorage.getItem(user));
        const pass = userData['password'];
        await this.checkErrors(pass);
        if(this.state.errors.length<1){
            userData['password'] = this.state.newPass;
            await AsyncStorage.setItem(user, JSON.stringify(userData));
            this.props.navigation.navigate('Settings');
        }
        
    }

    render(){
        return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
              <TextInput
                placeholder="previous password"
                value={this.state.prevPass}
                onChangeText = {(prevPass)=> this.setState({prevPass})}
                secureTextEntry={true}
                style={{borderWidth: 1, padding: 10, width: 200}}
              />
              <TextInput
                placeholder="new password"
                value={this.state.newPass} onChangeText = {(newPass)=> this.setState({newPass})}
                secureTextEntry={true}
                style={{borderWidth: 1, padding: 10, minWidth: 200}}
              />
              <TextInput
                placeholder="confirm password"
                value={this.state.confPass} onChangeText = {(confPass)=> this.setState({confPass})}
                secureTextEntry={true}
                style={{borderWidth: 1, padding: 10, minWidth: 200}}/>
              <Button title="enter" onPress={this.handleEnter} />
              <Errors errors={this.state.errors}/>
          </View>
          
        </TouchableWithoutFeedback>
        )
    }
}

const Errors = (props) => {
    return (
      <View style={{borderWidth: 1, alignItems: 'center', width: '100%'}}>
        {props.errors.map((error, i) => <Text key={i} style={{color: 'red', paddingTop: 10}}> {error} </Text>)}
      </View>
    );
  } 
