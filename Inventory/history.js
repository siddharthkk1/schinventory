import * as React from 'react';
import { Text, View, Button, FlatList, AsyncStorage, header, TextInput} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import Constants from 'expo-constants';


class HistoryScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            checkKeys: [],
            checkData: [],
            historyKeys: [{key: '0'}],
            historyData: {'0': {},}
        }
    }
    componentDidMount(){
        this.getCheckoutData();
        this.getTransactions();
        
    }
    componentDidUpdate(prevProps) {
        if ((prevProps.isFocused !== this.props.isFocused) && this.props.isFocused) {
            this.getCheckoutData();
            this.getTransactions();
        }
        //console.log(this.state.historyKeys);
        //console.log(this.state.historyData);
      }

    getCheckoutData = async() => {
        //await AsyncStorage.clear();
        const username = await AsyncStorage.getItem('userToken');
        const userData = JSON.parse(await AsyncStorage.getItem(username));
        let checkData; 
            await userData['checkouts'] === '[]' ? checkData = [] : checkData = await userData['checkouts'];
        let checkKeys = [];
        for (var i in checkData){
            checkKeys.push({key: ''+i});
        }
        await this.setState({checkData, checkKeys});
        //console.log(typeof(this.state.checkData));
        //console.log(this.state.checkKeys);
        
    }
    getTransactions = async() => {
        const username = await AsyncStorage.getItem('userToken');
        const userData = JSON.parse(await AsyncStorage.getItem(username));
        
        let historyData = await userData['trans'];
        //console.log(historyData);
        if (historyData == '[]'){
            historyData = [];
        }
        let historyKeys = [];
        //console.log('historyData: '+ historyData.length);
        for(var i in historyData){
            //console.log(i);
            historyKeys.push({key: ''+i});
        }
        //console.log (historyKeys);
        await this.setState({historyData, historyKeys});
        console.log(this.state.historyData);
        console.log(this.state.historyKeys);
    }
    cons = async() => {
        const userData = JSON.parse(await AsyncStorage.getItem(await AsyncStorage.getItem('userToken')));
        const trans = userData['trans'];
        //console.log(trans);
        //console.log(typeof(trans));
    }
    render() {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Constants.statusBarHeight}}>
            <View style={{flex: 1, backgroundColor: 'lavender', borderWidth: 1, width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                <Text style={{fontSize: 35}}>History</Text>
            </View>
            <Text style={{fontSize: 20}}>Checked Out Items</Text>
            <View style={{flex: 5, width: '100%', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <FlatList
                    data={this.state.checkKeys}
                    renderItem={({item, index}) => (
                    <View style={{height: 50, borderWidth: 1, backgroundColor: 'beige', flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', width: 320}}>
                        <Text style={{fontSize: 30}}>{this.state.checkData[parseInt(item.key)]}</Text>
                    </View>
                    )}
                    extraData={this.state}
                />
            </View>
            <Text style={{fontSize: 20}}>Transactions History</Text>
            <View style={{flex: 5, width: '100%', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <FlatList
                    data={this.state.historyKeys}
                    renderItem={({item, index}) => (
                    <View style={{minHeight: 50, borderWidth: 1, backgroundColor: 'beige', justifyContent: 'center', alignItems: 'center', width: 320}}>
                        <Text>{this.state.historyData[parseInt(item.key)]['item']}</Text>
                        <Text>Location: {this.state.historyData[parseInt(item.key)]['checkedOut_Loc']}</Text>
                        <Text>Event: {this.state.historyData[parseInt(item.key)]['checkedOut_Event']}</Text>
                        <Text>Checked Out @ {this.state.historyData[parseInt(item.key)]['checkedOut_Time']}</Text>
                        <Text>Checked in @ {this.state.historyData[parseInt(item.key)]['checkIn_Time']===undefined? 'pending': this.state.historyData[parseInt(item.key)]['checkIn_Time']}</Text>
                    </View>
                    )}
                    extraData={this.state}
                />
            </View>
        </View>
          )
    }
  
}
export default withNavigationFocus(HistoryScreen);