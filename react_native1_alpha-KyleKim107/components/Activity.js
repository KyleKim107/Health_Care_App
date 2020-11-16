import * as React from 'react';
import { Component} from 'react';
import { StyleSheet, Text,ScrollView,TouchableOpacity,KeyboardAvoidingView, View,TextInput, Button}from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import ListOfActivity from './ListOfActivity'

export default class Activity extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activities: [],
        }
        this.moveToDefault = this.moveToDefault.bind(this);
        this.moveToCreateActivity = this.moveToCreateActivity.bind(this);
        this.parseActivity = this.parseActivity.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {    
        this.props.navigation.navigate("Home");
      }

    async componentDidMount(){
        const token = await AsyncStorage.getItem('token')
        this.setState({token: token});
       
        await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: {'x-access-token': this.state.token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({activities: responseJson.activities});
        })
        .catch((error) => {
            console.error("Error:" + error);
        });

        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: {'x-access-token': this.state.token},
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
    moveToDefault(){
        this.props.navigation.navigate('Default');
    }
    moveToCreateActivity(){
        this.props.navigation.navigate('CreateActivity');
    }

    parseActivity() {
        //console.log("parse", this.state.activities);
        if(this.state.token === undefined) {
            return;
        }

        let activities = this.state.activities;

        if(activities.length === 0) {
            return;
        }

        let data = [];
        //console.log(activities, activities.length);
        for(let i=0; i<activities.length; i++){
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

        let cards = [];
        cards.push(
            <ListOfActivity key="1" data={data}/>
        );

        return cards;
    }


    render(){
        return(
            <KeyboardAvoidingView>
                <ScrollView style={{height: "100%", width: "100%"}}>
                    <View style={{padding:10, alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#38ADE1"}}>
                            <Text style={{color: "white", fontSize: 30}}>Activity</Text>
                    </View>
                    <View style={{backgroundColor:  'skyblue'}}>
                        {this.parseActivity()}
                        <View style={{padding:10, alignItems: 'center', justifyContent: 'center', width: "100%", height: 40, backgroundColor:  '#00FFFF'}}>
                                <Text style={{color: "white", fontSize: 20}}>Swipe Left to Delete, Right to Edit</Text>
                        </View>
                        <TouchableOpacity style={styles.btnContainerForBlue} onPress={this.moveToCreateActivity}>
                                        <Text style={styles.btnText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnContainerForBlue} onPress={this.moveToDefault}>
                                        <Text style={styles.btnText}>Back To Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnContainer} onPress={this.logOut}>
                                        <Text style={styles.btnText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        )
    }

}

const styles = StyleSheet.create({
    dateBox: {
        height: 40,
        marginBottom: 20,
        width: "100%",
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 20,
    },
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
