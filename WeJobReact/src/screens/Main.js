import React, {Component} from 'react';
import LoggedOut from './LoggedOut';
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
            return <LoggedOut loginFinished={this.loginFinished} navigation={this.props.navigation} />;
        }
        var string = this.state.student.email + ' ' + this.state.student.name;
        return <Text>{string}</Text>;
    }
    render() {
        return this.getScreenToShow();
        
            
    }
}