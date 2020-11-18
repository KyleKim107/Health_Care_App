


import * as React from 'react';
import { Component} from 'react';
import { StyleSheet, Text,TouchableOpacity, View,TextInput, Button}from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          token:'',
          username: '',
          password: '',
        };
    
        this.logIn = this.logIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.switchScreen = this.switchScreen.bind(this);
      }


      handleChange(key, val) {
        this.setState({ [key]: val})
      }

      switchScreen() {
        this.props.navigation.navigate('SignUp');
      }

      async logIn() {
        let key;
        let token;
        await fetch('https://mysqlcs639.cs.wisc.edu/login', {
          method: 'GET',
          headers: {'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)},
        })
        .then((response) => response.json())
    .then((responseJson) => {
      key = Object.keys(responseJson)[0];
      token = Object.values(responseJson)[0];
    })
    .catch((error) => {
      console.error(error);
    });   

    if(key === "token") {
      // Save username and token persistently
      AsyncStorage.setItem('username', this.state.username);
      AsyncStorage.setItem('token', token);   
      this.props.navigation.navigate('Default');
    } else {
        alert("Incorrect username or password! Please try again.");
      }
       
      }
      
    render(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:30  }}>
      <View accessible={false}>
        <Text style={{  
                fontSize: 40,
                fontWeight: 'bold',
                marginBottom: 5}}
                accessible={false}
                > FitnessTracker</Text>
        <Text style={{  
                fontSize: 15,
                marginBottom: 15}}
                accessible={false}  > Welcome, pleaes login or sighup to continue</Text>
      </View>
        <View style={styles.view2}  >
          <TextInput style={styles.passWord }  placeholderTextColor="#fff"               
          onChangeText={val => this.handleChange('username', val)}
          accessible={true} accessibilityLabel="Text field For Username"
          accessibilityHint = "Fill out your username"/>
          </View>
        <View style={styles.view2}>
          <TextInput style={styles.passWord}  secureTextEntry={true}  placeholderTextColor="#fff"
          onChangeText={val => this.handleChange('password', val)}
          accessible={true} accessibilityLabel="Text field For Password"
          accessibilityHint = "Fill out your password"/>
        </View>
        <View style={{padding:15}}>
        <View style={{padding:15}}>
          <TouchableOpacity style={styles.btnContainerForBlue } title='Login' onPress={this.logIn} 
          accessible={true} accessibilityLabel="Login Button"
          accessibilityHint = "Move to default page once you succeed login">
              <Text>Login</Text>
          </TouchableOpacity>
        </View>
        <View>
           <TouchableOpacity style={styles.btnContainerForBlue } onPress={() => this.props.navigation.navigate('SignUp')} title='Sign Up'
            accessible={true} accessibilityLabel="Signup button"
            accessibilityHint = "Move to Signup page for Signup" >
              <Text>Signup</Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>
  );
}}
const styles = StyleSheet.create({
  text:{  
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 5},
      textsecond:{  
      fontSize: 15,
      marginBottom: 15},

    btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      },
    
  view:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'},

    view2:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
      },

  passWord:{ height:50,
    color:"white"},

  button:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
  },
  btnContainerForBlue: {
    backgroundColor: "#38ADE1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
});
