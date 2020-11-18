import * as React from 'react';
import { Component} from 'react';
import { StyleSheet, SafeAreaView,Text,KeyboardAvoidingView,TouchableOpacity,ScrollView, View,TextInput, Button}from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import DatePicker from 'react-native-datepicker';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import TimePicker from 'react-native-simple-time-picker';


export default class CreateActivity extends React.Component {
    constructor(props){
        super(props);
        this.state={
            activity: {},
            name:null,
            duration:null,
            calories:null,
            date:null,
            selectedSec:'00'

        }

        this.handleChange = this.handleChange.bind(this);
        this.createActivity = this.createActivity.bind(this);
        this.moveToDefault = this.moveToDefault.bind(this);
        this.dateAndtimeFunc = this.dateAndtimeFunc.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {    
        this.props.navigation.navigate("Home");
      }
    moveToDefault(){
        this.props.navigation.navigate('Activity');
    }

    handleChange(key, val, type="string") {
        let newVal;

        if(type === "float" || type ==="int") {
            newVal = String(val);
            this.setState({ [key]: newVal})
        } else {
            this.setState({ [key]: val})
        }
    }
    dateAndtimeFunc(){
        set.state={
            date: date + selectedHours + selectedMinutes
        }

    return String(this.state.date);
    }
    async createActivity() {
        const token =  await AsyncStorage.getItem('token');
        let newDate = this.state.date + "T" + this.state.selectedHours + ":" + this.state.selectedMinutes + "." +this.state.selectedSec;
        await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                duration: this.state.duration,
                date:  this.state.date,
                calories: this.state.calories,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
        })
        .catch((error) => {
            console.error("Error:" + error);
        });
    
        let activity = {
            name: this.state.name,
            duration: this.state.duration,
            date: this.state.date,
            calories: this.state.calories,
        }
        this.setState({activity:activity});
        this.props.navigation.navigate('Activity');
      }

//       <View style ={styles.rowContainer}>
//       <Text style={styles.text}>Date and Time(Ex MM-DD-YYYYThh:mm:ss)</Text>
//       <TextInput placeholder="Date and Time" onChangeText={val => this.handleChange('date', val)} style={styles.input}/>
//   </View>

    render(){
        return(
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={15}>
                <ScrollView>  
                <View style={{alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#38ADE1"}}>
                      <Text style={{color: "white", fontSize: 30}}>Create an Activity</Text>
                </View>
                <View style={styles.inner}>
                        <View style ={styles.rowContainer}>
                            <Text style={styles.text}>Exercise Name</Text>
                            <TextInput  onChangeText={val => this.handleChange('name', val)} style={styles.input}
                             accessible={true} accessibilityLabel="Text field For Activity Name"
                             />
                        </View>
                        <View style ={styles.rowContainer}>
                            <Text style={styles.text}>Duratoin (minutes)</Text>
                            <TextInput  onChangeText={val => this.handleChange('duration', val)} style={styles.input}
                            accessible={true} accessibilityLabel="Text field for activity’s Duration"/>
                        </View>
                        <View style ={styles.rowContainer}>
                            <Text style={styles.text}>Calories Burnt</Text>
                            <TextInput  onChangeText={val => this.handleChange('calories', val)} style={styles.input}
                            accessible={true} accessibilityLabel="Text field for total calories burnt"/>
                        </View>
                       
                         <DatePicker
                            style={styles.datepicker}
                            date={this.state.date} //initial date from state
                            mode="date" 
                            
                            is24Hour={true}
                            format="YYYY-MM-DD"
                            minDate="01-01-2020"
                            maxDate="31-12-2020"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                                dateText: {
                                    color: "#af4448",
                                    fontSize: 20
                                },
                                placeholderText: {
                                    color: "#af4448"
                                },
                                dateTouchBody: {
                                    backgroundColor: "white",
                                },
                                dateInput: {
                                    borderWidth: 0,
                                    borderRadius: 5,
                                }
                            }}
                            accessible={true} accessibilityLabel="Calendar for pick a date for the activity"
                            onDateChange={date => {
                                this.setState({ date: date });
                            }}
                        />

                <SafeAreaView style={styles.container}>
                    <View style={styles.container}>
                        
                        <Text style={styles.title}>
                        Selected Time: {this.state.selectedHours}:{this.state.selectedMinutes}
                        </Text>
                        <TimePicker
                        accessible={true} accessibilityLabel="Dial to set the time"
                        selectedHours={this.state.selectedHours}
                        //initial Hourse value
                        selectedMinutes={this.state.selectedMinutes}
                        //initial Minutes value val => this.handleChange( 'goalDailyActivity', val)
                        onChange={(hours, minutes) => {
                            this.handleChange( 'selectedHours' ,hours);
                            this.handleChange( 'selectedMinutes' ,minutes);
                        }}
                        />
                    </View>
                    </SafeAreaView>

                    
                        <View style={styles.rowContainerButton}>
                            <TouchableOpacity style={styles.btnContainer} onPress={this.createActivity}
                            accessible={true} accessibilityLabel="Button to Create an Activity"
                            accessibilityHint = "Move to activity page after craeting an activity">
                                    <Text style={styles.btnText}>Save Exercise</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnContainer} onPress={this.moveToDefault}>
                                    <Text style={styles.btnText}>Nevermind</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnContainer} onPress={this.logOut}>
                                <Text style={styles.btnText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
      },
    datepicker:{
        height: 40,
        marginBottom: 20,
        width: "100%",
    },
    input: {
        height: 40,
        width:'60%',
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    inner: {
        flex: 1,
        // justifyContent: "flex-start",
    },
    root: {
        flexDirection: "column",
      },
    rowContainer: {
        flex: 1, 
        flexDirection: "row",
        marginLeft: 30,
        // justifyContent: "space-between",
        // alignItems: "center"
      },
      rowContainerButton: {
        flex: 1, 
        flexDirection: "row",
        // marginLeft: 400,
        
        // alignItems: "center"
      },
      text: {
        // textAlign: 'center',
        flex: 1,
        

      },
      btnContainer: {
        justifyContent: "flex-start",
        backgroundColor: '#38ADE1',
        width: '30%',
        height: 35,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      },
      btnText: {
        color: "white",
        fontSize: 20,
        fontSize: RFPercentage(2)
      },
      btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      }
    
});