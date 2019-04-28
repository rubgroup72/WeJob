import React, {Component} from 'react';
import colors from '../styles/colors';
import LoggedOut from './LoggedOut';
import NavBarButton from '../components/buttons/NavBarButton';
import {StyleSheet, Text, View, Image, Button, AsyncStorage } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

export default class Main extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userLoggedOut: true,
            loginWithFacebook: false,
            loginWithGoogle: false,
            loginWithEmail: false,
            Student: null,
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTransparent: true,
          headerTintColor: colors.green01,
          headerRight: (
            <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="left" color={colors.white} text="  לצפייה במשרות ללא הרשמה" />
          )
        }
      }

    loginFinished = (loginProvider, student) => {
        this.setState({ 
            userLoggedOut: false, 
            loginWithFacebook: (loginProvider === 'facebook'),
            loginWithGoogle: (loginProvider === 'google'),
            loginWithEmail: (loginProvider === 'email'),
            student: student,
         });
    }
    logoutFacebook = () => {
        this.setState({ 
            userLoggedOut: true,
            loginWithFacebook: false,
            student: null,
        });
        AsyncStorage.setItem('FacebookToken', '');
    }
    getScreenToShow = () => {
        if (this.state.userLoggedOut) {
            return  <LoggedOut loginFinished={this.loginFinished} navigation={this.props.navigation} />;
        }
        var string = this.state.student.email + ' ' + this.state.student.name;
        return <LoggedOut loginFinished={this.loginFinished} navigation={this.props.navigation} />;
        //<Text>{string}</Text>
    }
    render() {
        return this.getScreenToShow();
        
            
    }
}