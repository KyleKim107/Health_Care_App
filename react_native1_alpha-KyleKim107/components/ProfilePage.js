
import * as React from 'react';
import { Button, KeyboardAvoidingView, SafeAreaView, StyleSheet,
  Text, TextInput, ScrollView, View } from "react-native";
  import { TouchableOpacity } from 'react-native-gesture-handler';
  import AsyncStorage from '@react-native-community/async-storage'

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            username: '',
            firstName: '',
            lastName: '',
            goalDailyCalories: '',
            goalDailyProtein: '',
            goalDailyCarbohydrates: '',
            goalDailyFat: '',
            goalDailyActivity: '',
            load: false
        };
        this.updateinfo = this.updateinfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logOut = this.logOut.bind(this);

    }
    logOut() {    
      this.props.navigation.navigate("Home");
    }
  async componentDidMount(){
      var json=[];
      var token =  await AsyncStorage.getItem('token');
      var username =  await AsyncStorage.getItem('username');
   //   alert(username + "  " + token);
      this.setState({token: token});
      this.setState({username: username});
      let url = 'https://mysqlcs639.cs.wisc.edu/users' + '/' + username;
      fetch(url, {
          method: 'GET',
          headers: {
              'x-access-token': token
          },
      }).then(response => response.json())
      .then(responseJson => {
          const userStr = JSON.stringify(responseJson);
          while(this.state.load == false){
              JSON.parse(userStr, (key, value) =>{
                  if(key == 'firstName'){
                    alert("Once you type a blank, all blanks will filled up!");

                      this.state.firstName = value;
                  }
                  if(key == 'goalDailyFat'){
                    this.state.goalDailyFat = value.toString()  ;                
                  }
                  if(key == 'goalDailyCarbohydrates'){

                    this.state.goalDailyCarbohydrates = value.toString();
                                    }
                  if(key == 'goalDailyCalories'){
                    this.state.goalDailyCalories = value.toString();
                                    }
                  if(key == 'goalDailyActivity'){
                    this.state.goalDailyActivity = value.toString();
                                    }
                  if(key == 'goalDailyProtein'){
                    this.state.goalDailyProtein = value.toString();
                                    }
                  if(key == 'lastName'){
                    this.state.lastName= value;
                                    }
              }) 
              this.state.load = true;
              
        }

      });
  

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

  async updateinfo() {
    if(this.state.firstName === null) {
      this.setState({firstName: "..."});
    }
    if(this.state.lastName === null) {
      this.setState({lastName: "..."});
    }
    if(this.state.goalDailyCalories === null) {
      this.setState({goalDailyCalories: 0});
    }
    if(this.state.goalDailyCarbohydrates=== null) {
      this.setState({goalDailyCarbohydrates: 0});
    }
    if(this.state.goalDailyProtein === null) {
      this.setState({goalDailyProtein: 0});
    }
    if(this.state.goalDailyFat === null) {
      this.setState({goalDailyFat: 0});
    }
    if(this.state.goalDailyActivity === null) {
      this.setState({goalDailyActivity: 0});
    }


    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.state.token,
      },
      body: JSON.stringify({
        firstName: this.state.firstName,        
        lastName: this.state.lastName,     
        goalDailyCalories: this.state.goalDailyCalories,   
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,   
        goalDailyActivity: this.state.goalDailyActivity, 
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log("Edit", responseJson);
    })
    .catch((error) => {
      console.error(error);
    });

      alert("Update complete, Move to Login Page!")
       this.props.navigation.navigate('Default');
    }

  tokenChecker(){
    
      return this.state.token + " " +  this.state.username;
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={15}>
        <ScrollView>
        <View style={styles.container}>
                <Text style={styles.bold}> Personal Info</Text>
              </View>
          <View styel ={styles.container}>
          <Text style={styles.texts}> First Name</Text>
            <View style={styles.view2}>
              <TextInput style={styles.passWord } 
              onChangeText={val => this.handleChange('firstName', val)}  keyboardType={'numeric'}  defaultValue={this.state.firstName}              />
            </View>
            <View styel ={styles.container}>
            <Text style={styles.texts}> Last Name</Text>

            <View style={styles.view2}>
              <TextInput style={styles.passWord } 
              onChangeText={val => this.handleChange('lastName', val)} keyboardType={'numeric'} defaultValue={this.state.lastName}/>
            </View>

              <View style={styles.container}>
                <Text style={styles.bold}> Fitness Goal</Text>
              </View>
            <Text style={styles.texts}> Daily Calories (Kcal)</Text>
            <View style={styles.view2}>
              <TextInput style={styles.passWord } 
              onChangeText={val => this.handleChange('goalDailyCalories', val)}keyboardType={'numeric'} defaultValue={this.state.goalDailyCalories}/>
            </View>
          <Text style={styles.texts}> Daily Protein (gram)</Text>
          <View style={styles.view2}>
              <TextInput style={styles.passWord } 
              onChangeText={val => this.handleChange('goalDailyProtein', val)} keyboardType={'numeric'} defaultValue={this.state.goalDailyProtein}/>
            </View>
          <Text style={styles.texts}> Daily Carbs(gram)</Text>
          <View style={styles.view2}>
              <TextInput style={styles.passWord } 
              onChangeText={val => this.handleChange('goalDailyCarbohydrates', val)} keyboardType={'numeric'} defaultValue={this.state.goalDailyCarbohydrates}/>
            </View>
          <Text style={styles.texts}> Daily Fat (gram)</Text>
          <View style={styles.view2}>
              <TextInput style={styles.passWord }  
              onChangeText={val => this.handleChange('goalDailyFat', val)} keyboardType={'numeric'} value={this.state.goalDailyFat}/>
            </View>
          <Text style={styles.texts}> Daily Activity (mins)</Text>
          <View style={styles.view2}>
              <TextInput style={styles.passWord }  
              onChangeText={val => this.handleChange( 'goalDailyActivity', val)} keyboardType={'numeric'} value={this.state.goalDailyActivity}/>
            </View>
          </View>
        </View>

        <View style={{padding:15}}>
          <Button style={styles.button }onPress={this.updateinfo} title='Save Profile' />
        </View>
        <View>
          <Button style={styles.button } onPress={() => this.props.navigation.navigate('Home')} title='Exit' />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  bold:{  
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 5},

  container:{
   flex: 1, alignItems: 'center', justifyContent: 'center',  
  },
  texts:{
    alignItems: 'center',
    fontSize: 15,
    marginBottom: 15,
    padding: 10,

  },
  view2:{ width: 350,
     height: 40,
      borderColor: 'gray',
      borderWidth: 3,
      padding: 10,
      },

  passWord:{ height:20,
    color:"green"},

  container: {
      backgroundColor: "#ffcdd2",
      flex: 1,
  },
  sectionHeading: {
    margin: 8,
    fontSize: 25,
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
    backgroundColor: "#af4448",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  btnContainer2: {
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
    btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
      },
});

