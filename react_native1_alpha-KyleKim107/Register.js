import React, { Component } from 'react';
  import { StatusBar } from 'expo-status-bar';
  import { StyleSheet, Text, View,TextInput, Button} from 'react-native';
  import { createStackNavigator } from '@react-navigation/stack';

export default class RegisterPage extends Component{
    render(){
        return(
<View style={{flex: 1,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center'}}>

                <Text style={{  fontSize: 40,fontWeight: 'bold',  marginBottom: 5}}> FitnessTracker</Text>
                <Text style={{  fontSize: 15,  marginBottom: 15}}> New here? Let's get started!{'\n'}
                Please create an account below </Text>
                <View style={{width:"80%",backgroundColor:"#465881",borderRadius:25,height:50,marginBottom:20,justifyContent:"center"}}>  
                    <TextInput  
                        style={{ height:50,
                        color:"white"}}
                        placeholder="  Enter Your Name" 
                        placeholderTextColor="#fff"
                        returnKeyType = "ID"
                        ref = {(input) => thisemailinput = }
                        onChangeText={text => this.setState({userName:text})}/>
                    </View>
                    <View style={{width:"80%",backgroundColor:"#465881",borderRadius:25,height:50,marginBottom:20,justifyContent:"center"}}>
                    <TextInput  
                        style={{ height:50,
                        color:"white"}}
                        placeholder ="   Enter Password for Register" 
                        placeholderTextColor = "#fff"
                        returnKeyType = "password"
                        onChangeText={text => this.setState({password:text})}/>
                    </View>
                    <Button style={{width:"80%",
                        backgroundColor:"#fb5b5a",
                        borderRadius:25,
                        height:50,
                        alignItems:"center",
                        justifyContent:"center",
                        marginTop:40,
                        marginBottom:10
                        }} onPress={() => this.props.navigation.navigate('Login')} title='Sign Up' />
                </View>



        );
    }

}