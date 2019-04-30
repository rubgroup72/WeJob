import React, {Component} from 'react';
import colors from '../styles/colors';
import InlineImage from '../components/InlineImage'
import {StyleSheet, Text, View, Image, Button, ImageBackground, AsyncStorage } from 'react-native';
import RoundedButton from '../components/buttons/RoundedButton';
import NavBarButton from '../components/buttons/NavBarButton';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { createStackNavigator, createAppContainer } from 'react-navigation';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import Global from '../global';
import { LoginManager } from 'react-native-fbsdk';


export default class LoggedOut extends React.Component{

    onFacebookPress(){
        alert('Facebook button pressed');
    };

    onGooglePlusPress(){
        alert('Google+ button pressed');
    };

    onRegiterPress = () => {
        this.props.navigation.navigate("Register");
    };
    onLoginPress = () => {
        this.props.navigation.navigate("LogIn");
    };

    handleFacebookLogin = () => {
        const navigationObj = this.props.navigation;
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
          function (result) {
            if (result.isCancelled) {
                alert("login is cancelled.");
            } else {
                AccessToken.getCurrentAccessToken().then(
                (data) => {
                    AsyncStorage.setItem(Global.FACEBOOK_TOKEN_STRING, data.accessToken.toString());
                    navigationObj.navigate('Main');
                    //this.props.navigation.navigate('Main');
                    // this.props.fetchFacebookUserData(data.accessToken.toString());
                })
            }
          },
          function (error) {
            alert('Login fail with error: ' + error)
          }
        )
      }

    render(){
        const {navigate} = this.props.navigation;
        return (
            <ImageBackground style={ styles.imgBackground } 
                 resizeMode='cover' 
                 source={require('../img/blue.jpeg')}>
                 <View style={styles.wrapper}>
              <View style={styles.welcomeWrapper}>
                <Text style = {styles.welcomeText}> 
                    WeJ
                    <InlineImage
                    style={{ width:15, height:15}}
                    source={require('../img/Ruppin_Academic_Center_Logo.png')}/>
                    b
                </Text>
                
                <RoundedButton
                text = ' התחבר עם פייסבוק'
                textColor = {colors.green01}
                background= {colors.white}
                icon={<Icon name="facebook" size={20} style = {styles.facebookButtonIcon}/>}
                handleOnPress={this.handleFacebookLogin}
                />
                {/* <Button
        onPress={this.handleFacebookLogin}
        title="Continue with fb"
        color="#4267B2"
      /> */}
                {/* <LoginButton
                    style = {styles.facebookNativeButton}
                    readPermissions={['public_profile', 'email']}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("login has error: " + result.error);
                            } else if (result.isCancelled) {
                                alert("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    alert(data.accessToken.toString());
                                    AsyncStorage.setItem(Global.FACEBOOK_TOKEN_STRING, data.accessToken.toString());
                                    
                                    this.props.fetchFacebookUserData(data.accessToken.toString());
                                })
                            }
                        }
                    }
                    onLogoutFinished={() => this.props.logoutFacebook()} /> */}
                {/* <RoundedButton
                text = 'Google+ התחבר עם'
                textColor = {colors.white}
                icon={<Icon name="google" size={20} style = {styles.googleButtonIcon}/>}
                handleOnPress={this.onGooglePlusPress}
                /> */}
                <Text 
                style={{color: 'white', alignSelf: 'center', textDecorationLine: 'underline'}}
                onPress={this.onLoginPress}>
                משתמש רשום?
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.drawLine} />
                  <Text style={styles.orText}>או</Text>
                  <View style={styles.drawLine} />
                 </View>
                 <RoundedButton
                   text = 'הירשם'
                   textColor = {colors.white}
                   handleOnPress={this.onRegiterPress}
                />
                <Text style = {styles.notShareWithoutPermissionsText}>
                    אנחנו לעולם לא נשתף דבר ללא רשותך
                </Text>
              </View>
            </View>
            </ImageBackground>
            
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        display: 'flex',
        
    },
    welcomeWrapper:{
        flex: 1,
        display: "flex",
        marginTop: 30,
        padding: 20 

    },
    welcomeText: {
        fontSize: 60,
        color: colors.white,
        fontWeight: "500",
        marginTop: 20,
        marginBottom: 20,
        padding: 80,
        textShadowColor: 'rgba(0, 0, 0, 0.85)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },

    // facebookButtonIcon: {
    //     color: colors.green01,
    //     position: 'relative',
    //     left: 20,
    //     zIndex: 8,
    // },
    facebookNativeButton: {
        height: 40,
        width: 350,
        alignSelf: 'center',
        marginBottom: 40,

    },
    googleButtonIcon: {
        color: colors.white,
        position: 'relative',
        left: 20,
        zIndex: 8,
    },
    notShareWithoutPermissionsText:{
        color: colors.white,
        alignSelf: 'center',
        marginTop: -15,
        
    },
    drawHorizontalLine:{
        marginTop: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    orText:{
        color: colors.white,
        alignSelf:'center',
        paddingHorizontal:5,
        paddingTop: 20,
        marginBottom: 20
    },
    drawLine:{
        backgroundColor: colors.white,
        height: 2,
        flex: 1,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20
        
    },

    logInButton: {
        color: 'red',
        paddingLeft: 22
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
},


});