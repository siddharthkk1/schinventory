import * as React from 'react';
import {TextInput, Button, AsyncStorage, View, Keyboard, Text, TouchableWithoutFeedback} from 'react-native';

export default class ChangeEmailScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newEmail: '',
            errors: [],
        }
    }

    checkErrors = (pass) => {
        const errorsArray = [];
        if(!(this.state.newEmail.includes('@') && this.state.newEmail.includes('.'))){
            errorsArray.push('must use valid email address');
        }
        this.setState({errors: errorsArray});
  
      }

    handleEnter = async() => {

        const user = await AsyncStorage.getItem('userToken');
        let userData = JSON.parse(await AsyncStorage.getItem(user));
        this.checkErrors();

        if(this.state.errors.length<1){
            userData['email'] = this.state.newEmail;
            await AsyncStorage.setItem(user, JSON.stringify(userData));

            this.props.navigation.state.params.setUser();
            this.props.navigation.navigate('Settings');
        }
        
    }

    render(){
        return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
              <TextInput
                placeholder="new email"
                value={this.state.newPass} onChangeText = {(newEmail)=> this.setState({newEmail})}
                style={{borderWidth: 1, padding: 10, minWidth: 200}}
              />
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
