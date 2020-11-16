
import React, { useImperativeHandle } from 'react';
import { createAppContainer, createSwitchNavigator  } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import signUp from './components/signUp';
import { NavigationContainer } from '@react-navigation/native';
import ProfilePage from './components/ProfilePage';
import Default from './components/Default';
import Activity from './components/Activity';
import CreateActivity from './components/CreateActivity';
import ListOfActivity from './components/ListOfActivity';
import ActivityEdit from './components/ActivityEdit';
const Stack = createStackNavigator();

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      username:null,
      token:null
    }
    this.auth = this.auth.bind(this);
  }
  auth(name, tok){
    this.setState({
      username: name,
      token: tok
    });
    console.log(this.state.username);
  }

  render(){
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
              name="Home"
              component={Login}
            >
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={signUp} />
      <Stack.Screen name="Profile" component= {ProfilePage}/>
      <Stack.Screen name="Default" component= {Default}/>
      <Stack.Screen name="Activity" component= {Activity}/>
      <Stack.Screen name="CreateActivity" component= {CreateActivity}/>
      <Stack.Screen name="ListOfActivity" component= {ListOfActivity}/>
      <Stack.Screen name="ActivityEdit" component= {ActivityEdit}/>

    </Stack.Navigator>
  </NavigationContainer>
  );
 };
}


