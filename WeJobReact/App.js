import React from 'react';
import { View, Text, Button } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import LogIn from './src/screens/LogIn';
import LoggedOut from './src/screens/LoggedOut';
import Register from './src/screens/Register';



const AppNavigator = createStackNavigator({
  Home: {
    screen: LoggedOut,
  },
  LogIn: {
    screen: LogIn,
  },
  Register: {
    screen: Register,
  }
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);
