import React ,{Component}from 'react';
import {Alert,Button, Text,TextInput, StyleSheet,View,KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions } from 'react-native';
import base64 from 'base-64';
import { StackNavigator } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default class singUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.signUp = this.signUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.switchScreen = this.switchScreen.bind(this);
  }

  async signUp() {

    if (this.state.username.length < 5) {
      alert("User name should be longer than 5 characters!");
      return;
  }

  if (this.state.password.length < 5) {
      alert("Password should be longer than 5 characters!");
      return;
  }
    let createdMsg;
    let key;
    let token;

    await fetch('https://mysqlcs639.cs.wisc.edu/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      createdMsg = Object.values(responseJson)[0];
    })
    .catch((error) => {
      console.error(error);
    });

    if(createdMsg === "User created!") {
      // Log In after sign up
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
        alert("User Created!")
        AsyncStorage.setItem('username', this.state.username);
        AsyncStorage.setItem('token', token);
        this.props.navigation.navigate('Home');
      }
    } 
    
    else {
      alert("Username already taken!");
    }
  }
  handleChange(key, val) {
    this.setState({ [key]: val})
  }


  switchScreen() {
    this.props.navigation.navigate('Home');
  }

  // <TextInput  
  //                         style={{ height:50,
  //                         color:"white"}}
  //                         placeholder="  User Name" 
  //                         onChangeText={val => this.handleChange('username', val)}/>
  //                 </View>
  //                 <View style={{width:"80%",backgroundColor:"#465881",borderRadius:25,height:50,marginBottom:20,justifyContent:"center"}}>
  //                   <TextInput  
  //                         style={{ height:50,
  //                         color:"white"}}
  //                         placeholder ="   Password" 
  //                         onChangeText={val => this.handleChange('password', val)}/>
  //                 </View>
  //                 <View style={styles.space} />

  //                 <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  //                   <Button style={styles.buttonInline } onPress={this.signUp} title='Signup' />
  //                   <View style={styles.space} />
  //                   <Button style={styles.buttonInline } onPress={() => this.props.navigation.navigate('Login')} title='Nevermind' />

      render() {

        return (
          <View style={styles.container}>
          <Text style={styles.bigText}>FitnessTracker</Text>
          <Text>New here? Let's get started!</Text>
          <Text>Please create an account below.</Text>
          <View style={styles.space} />
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Username"
            placeholderTextColor="#992a20"
            onChangeText={val => this.handleChange('username', val)}
                    value={this.state.username}
            autoCapitalize="none" />
          <TextInput style={styles.input}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            placeholder="Password"
            onChangeText={val => this.handleChange('password', val)} 
                    value={this.state.password}
            placeholderTextColor="#992a20"
            autoCapitalize="none" />
          <View style={styles.space} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="Create Account" onPress={this.signUp} />
            <View style={styles.spaceHorizontal} />
            <Button color="#a1635f" style={styles.buttonInline} title="Nevermind!" onPress={this.switchScreen} />
          </View>
        </View>
        );
      }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex"
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  }
});
