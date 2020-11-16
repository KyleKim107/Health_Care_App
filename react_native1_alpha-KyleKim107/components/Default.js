import * as React from 'react';
import { Component} from 'react';
import { StyleSheet, TouchableOpacity,ScrollView, Text,KeyboardAvoidingView, View,TextInput, Button}from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64';
import ListOfActivity from './ListOfActivity'

export default class Default extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            token:'',
            firstName:'',
            goalDailyActivity:'0'
        }
        this._isMounted = false;
        this.switchToProfile = this.switchToProfile.bind(this);
        this.logOut = this.logOut.bind(this);
        this.switchToMeal= this.switchToMeal.bind(this);
        this.switchToActivity= this.switchToActivity.bind(this);
        this.printFirstName = this.printFirstName.bind(this);
        this.LoadActivity = this.LoadActivity.bind(this);
        this.getTotalActivityTime = this.getTotalActivityTime.bind(this);
    }    
    getTotalActivityTime() {
      let curDate = new Date()
  
      let activities = this.state.activities;
      let totalDuration = 0;
  
      for(let i=0; i<activities.length; i++) {
        if(
          String(curDate.getDate()) === activities[i].date.substring(8,10) &&
          String(curDate.getMonth()+1) === activities[i].date.substring(5,7) &&
          String(curDate.getFullYear()) === activities[i].date.substring(0,4)
        ){
          totalDuration += activities[i].duration;
        }
      }
  
      return String(totalDuration);
    }

    async componentDidMount(){
        const token =  await AsyncStorage.getItem('token');
        const username =  await AsyncStorage.getItem('username');
    
        this.setState({token: token});
        this.setState({username: username});
    
        // Get User Information
        await fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
            method: 'GET',
            headers: {'x-access-token': token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState(responseJson);
        })
        .catch((error) => {
            console.error("Error:" + error);
        });
    
    
        // Get Activity Information
        await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: {'x-access-token': token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({activities: responseJson.activities});
        })
        .catch((error) => {
            console.error("Error:" + error);
        });
    
    
    
    
        // Update screen when in focus
        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
          // Get User Information
          await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
              method: 'GET',
              headers: {'x-access-token': token},
          })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState(responseJson);
          })
          .catch((error) => {
            console.error("Error:" + error);
          });
    
    
          // Get Activity Information
          await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
              method: 'GET',
              headers: {'x-access-token': token},
          })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({activities: responseJson.activities});
          })
          .catch((error) => {
              console.error("Error:" + error);
          });
          
        });
      }


    logOut() {    
        this.props.navigation.navigate("Home");
      }

      switchToProfile() {
        this.props.navigation.navigate('Profile');
      }

      switchToDefault() {
        this.props.navigation.navigate('Main');
      }
      switchToMeal() {
        this.props.navigation.navigate('Meal');
      }
      switchToActivity() {
        this.props.navigation.navigate('Activity');
      }
    printFirstName(){
        if(this.state.firstName != ''){
            return this.state.firstName
        }
    }

    LoadActivity() {
        //console.log("parse", this.state.activities);
        if(this.state.token === undefined) {
            return;
        }

        let activities = this.state.activities;

        if(activities.length === 0) {
            return;
        }
        let curDate = new Date();
        let data = [];
        //console.log(activities, activities.length);
        for(let i=0; i<activities.length; i++){
          if(
            String(curDate.getDate()) === activities[i].date.substring(8,10) &&
            String(curDate.getMonth()+1) === activities[i].date.substring(5,7) &&
            String(curDate.getFullYear()) === activities[i].date.substring(0,4)
          ){
            data.push(
                {
                    id: activities[i].id,
                    date: activities[i].date,
                    message: activities[i].name, 
                    calorie: activities[i].calories,
                    duration: activities[i].duration, 
                    navigation: this.props.navigation,
                }
            )
          }
        }

        let cards = [];
        cards.push(
            <ListOfActivity key="1" data={data}/>
        );

        return cards;
    }

    render(){
        return(
            <ScrollView style={{height: "100%", width: "100%"}}>
            <KeyboardAvoidingView >
                <View style={{padding:10, alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#38ADE1"}}>
                    <Text style={{color: "white", fontSize: 30}}>                 Hi, {this.printFirstName()}{'\n'}Here is your progress today</Text>
                </View>

                <View style={{flex: 1,
                        flexDirection: 'column',
                        alignItems: 'stretch',backgroundColor:  'powderblue', width: "100%", paddingVertical: 20}}>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, width: "100%", height: 50}}>
                        <Text style={styles.textStyle1}>Today's Total Activity</Text>
                        <Text style={styles.textStyle1}>Daily Goal Activity</Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, width: "100%", height: 50}}>
                        <Text style={styles.textStyle1}>{this.getTotalActivityTime()}</Text>
                        <Text style={styles.textStyle1}>{this.state.goalDailyActivity}</Text>
                    </View>
                </View>
                <View style={{padding:10, alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: 'skyblue'}}>
                    <Text style={{color: "white", fontSize: 30}}>Today's Activity</Text>
                </View>
                <View style={{flex: 1,
                        flexDirection: 'column',
                        alignItems: 'stretch',backgroundColor: 'skyblue', width: "100%", paddingVertical: 20}}>
                    {this.LoadActivity()}
                    </View>

                <TouchableOpacity style={styles.btnContainerForBlue} onPress={this.switchToProfile}>
                            <Text style={styles.btnText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnContainerForBlue} onPress={this.switchToActivity}>
                            <Text style={styles.btnText}>Acivity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContainer} onPress={this.logOut}>
                            <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    sectionHeading: {
        marginTop: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
      cardHeading: {
          marginTop: 5,
          marginBottom: 5,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
      },
      textStyle1: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      textStyle2: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
      },
      btnContainerForBlue: {
        backgroundColor: "#38ADE1",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      },
      btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      },
      btnText: {
        color: "white",
        fontSize: 20,
      },
    button:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
  }





});

