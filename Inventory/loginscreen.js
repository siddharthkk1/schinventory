import * as React from 'react';
import { Button, Animated, Text, View, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Constants from 'expo-constants';


export default class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            username: '',
            password: '',
        }
    }
    login = () => {
        fetch('http://localhost:19002', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        }).then(res => console.log(res));
        //this.props.navigation.navigate('inventory');
    }
    render() {
        return(
            <View>
                <TextInput 
                    placeholder="username"
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    style={{height: 20, width: 100, fontsize: 15}}
                />
                <TextInput 
                    placeholder="username"
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.duration}
                    style={{height: 20, width: 100, fontsize: 15}}
                />
            </View>
        )
    }

}