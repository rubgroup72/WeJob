import React from 'react';
import { View, Text, Button } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import LogIn from './src/screens/LogIn';
import LoggedOut from './src/screens/LoggedOut';
import Register from './src/screens/Register';
import Departments from './src/screens/Departments';
import Main from './src/screens/Main';



const AppNavigator = createStackNavigator({
  Home: {
    screen: Main,
  },
  LogIn: {
    screen: LogIn,
  },
  Register: {
    screen: Register,
  },
  Departments: {
    screen: Departments,
  }
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);
