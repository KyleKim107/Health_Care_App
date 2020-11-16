import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, ScrollView, 
    SafeAreaView, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import DatePicker from 'react-native-datepicker';
import TimePicker from 'react-native-simple-time-picker';
import Moment from 'moment';

export default class ActivityEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: {},
            name: null,
            duration: null,
            date: null,
            calories: null,

        };

        this.editActivity = this.editActivity.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logOut = this.logOut.bind(this);

    }
    logOut() {    
        this.props.navigation.navigate("Home");
      }
    handleChange(key, val, type="string") {
        let newVal;

        if(type === "float") {
            newVal = String(val);
            this.setState({ [key]: newVal})
        } else {
            this.setState({ [key]: val})
        }
    }

    async editActivity() {
        const token =  await AsyncStorage.getItem('token');
        let { id}= this.props.route.params;
        //const { id} = route.params;
        Moment.locale('en');
        let newD = this.state.date;
        Moment(newD).format('YYYY-DD-MM-hh:mm.ss');
        // let newDate = new Date(this.state.date);
        // let newDate = new Date(this.state.date + "T" + this.state.selectedHours + ":" + this.state.selectedMinutes)
        // alert(id + this.state.name + this.state.calories + this.state.duration  + " "+ this.state.date + " "+ newDate);

        if(this.state.date === null) {
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds
            this.setState({
              date: year + '/' + month + '/' + date + ' ' + hours + ':' + min + ':' + sec,
            });
        }
        if(this.state.name === null) {
            this.setState({name: "New Activity"});
        }
        if(this.state.calories === null) {
            this.setState({calories: 0});
        }
        if(this.state.duration === null) {
            this.setState({duration: 0});
        }

        console.log(this.state);
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                duration: this.state.duration,
                date: this.state.date,
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
        this.props.navigation.navigate('Activity', {activity: activity});
      }
 

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={15}>
            <ScrollView>
              <SafeAreaView style={styles.container}>
                <View style={styles.inner}>
                  <View style={{alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#38ADE1"}}>
                      <Text style={{color: "white", fontSize: 30}}>Edit Activity</Text>
                  </View>
    
                  <View style={{padding: 24}}>
                    <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', height: 50,backgroundColor:  'powderblue'}}>
                      <Text style={styles.sectionHeading}>Edit Activity</Text>
                    </View>
    
                    <TextInput placeholder="Name:" onChangeText={val => this.handleChange('name', val)} style={styles.input}/>
                    <TextInput placeholder="Duration(Min):" onChangeText={val => this.handleChange('duration', val)} style={styles.input} keyboardType={'numeric'}/>
                    <TextInput placeholder="Calories:" onChangeText={val => this.handleChange('calories', val)} style={styles.input} keyboardType={'numeric'}/>
                    <DatePicker
                            style={styles.datepicker}
                            date={this.state.date} //initial date from state
                            mode="date" 
                            placeholder="Click to Select Date!"
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
                    <TouchableOpacity style={styles.btnContainer} onPress={this.editActivity}>
                        <Text style={styles.btnText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnContainer} onPress={this.logOut}>
                            <Text style={styles.btnText}>Logout</Text>
                </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </ScrollView>
          </KeyboardAvoidingView>
    
        );
    }
}

const styles = StyleSheet.create({
    containerForTime: {
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
    container: {
        backgroundColor: 'skyblue',
        flex: 1,
    },
    sectionHeading: {
      margin: 8,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    inner: {
        flex: 1,
        justifyContent: "flex-end",
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    btnContainer: {
        backgroundColor: "#38ADE1",
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
    },
    btnText: {
        color: "white",
        fontSize: 20,
    },
    dateBox: {
        height: 40,
        marginBottom: 20,
        width: "100%",
    },
    btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      },
});