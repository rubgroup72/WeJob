import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import {Platform, StyleSheet, Text, View} from 'react-native';
import LoggedOut from './src/screens/LoggedOut';
import LogIn from "./src/screens/LogIn";

export default class App extends Component{
  render() {
    return (
      <Provider store = {store}>
        <LoggedOut />
       </Provider>
      
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View>
    );
  }
}
